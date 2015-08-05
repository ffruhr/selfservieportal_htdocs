#!/usr/bin/perl

use DBI;
use strict;
use CGI qw(:standard);
use CGI::Carp qw/fatalsToBrowser/;
use Data::Printer;
use JSON;

use vars qw( $HT_DOCS $BASE $DBH $cookie %user_hash %pdns_conf %communities );

$SIG{'ALRM'} = \&abort;
alarm(600);

require "base.pl";
require "$BASE/manage.conf";
require "$BASE/manage_html.pl";
require "$BASE/manage_auth.pl";
require "$BASE/manage_do.conf";
require "$BASE/manage_communities.conf";

# Datenbankverbindung aufbauen
$DBH = DBI->connect($Conf::mysql_conf{'db_conf'}, $Conf::mysql_conf{'user'},$Conf::mysql_conf{'pwd'})  || die "cannot connect to database $!";

# Session checken
&auth_session_check();

&main();
exit;

sub main
{
	my $do = param('do');
	
	my $stmnt = "SELECT * FROM do WHERE do_command = ? AND do_typ = 'H'"; 
	my $sth = $DBH->prepare($stmnt);
	my $rc = $sth->execute($do);

	if($rc == 1 && $do ne '')
	{
		my $ref = $sth->fetchrow_hashref();
		my $folder = $ref->{'do_folder'};
		my $file = $ref->{'do_file'};
		my $sub = $ref->{'do_sub'};
		my $do_id = $ref->{'do'};

		my $stmnt = "	SELECT * FROM right_group JOIN mitarbeiter_group ON mgr_grp = rgr_grp JOIN do ON do = $do_id 
				WHERE mgr_mit = $user_hash{'mit'} AND (rgr_do = $do_id OR rgr_do = do_parent)";
		my $sth = $DBH->prepare($stmnt);
		my $rc = $sth->execute();

		if($rc == 1)
		{
			require "$BASE/$folder/$file";
			\&{\&{$sub}}();
		
		}
		elsif($rc > 1)
		{
			&abort("Berechtigung doppelt vorhanden. $do");
		}
		else
		{
			&abort("Keine Rechte. $do");
		}
	}
	else
	{
		require "$BASE/core/manage_start.pl"; &show_start;
		exit;
	}
}


sub abort
{
        my ($err_code) = @_;
        print "Content-Type: text/plain\n\n";
        print "Es ist ein Fehler aufgetreten:\n";
        print "$err_code";
        exit;
}

<?php
header('Content-type: text/calendar;charset=utf-8');
header('Content-Disposition: attachment; filename="file.ics"');

// header('Content-Type: text/plain; charset=utf-8');

require_once 'ical.php';
$ical = new ical($_GET["uid"], $_GET["key"]);
echo $ical->get_filtered_content();
?>
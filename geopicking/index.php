<?php
$url = 'https://api.gbif.org/v1/species/match?name=allium%20ursinum';
if (isset($_GET['apiUrl'])) {
   $url = str_replace(' ', '%20', $_GET['apiUrl']);
   
}
 
$curl = curl_init($url);

curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

$result = curl_exec($curl);

curl_close($curl);
print $result;
?>

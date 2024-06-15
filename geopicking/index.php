<?php
$url = 'https://api.gbif.org/v1/species/match?name=allium%20ursinum';
if (isset($_GET['apiUrl'])) {
   $url = $_GET['apiUrl'];
   echo ' $url : ' .$url;
   print_r($_GET)
}
 
$curl = curl_init($url);

curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
//curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "GET");
//curl_setopt( $curl, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
//curl_setopt($curl, CURLOPT_POSTFIELDS, $encodedData);
$result = curl_exec($curl);

curl_close($curl);
print $result;
?>

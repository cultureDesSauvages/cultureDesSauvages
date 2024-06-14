<?php
$url = 'https://trefle.io/api/v1/genus?token=WY4938eNStvfSd3tTTUxQNQvoOVBhuaR4RPGbm61R8A';
$curl = curl_init($url);

curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
//curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "GET");
//curl_setopt( $curl, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
//curl_setopt($curl, CURLOPT_POSTFIELDS, $encodedData);
$result = curl_exec($curl);
curl_close($curl);
print $result;
?>

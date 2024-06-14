<?php
$url = 'https://trefle.io/api/v1/genus';
$data = array(
    "token" => "WY4938eNStvfSd3tTTUxQNQvoOVBhuaR4RPGbm61R8A"
    )
);
$encodedData = json_encode($data);
$curl = curl_init($url);
$data_string = urlencode(json_encode($data));
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt( $curl, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_POSTFIELDS, $encodedData);
$result = curl_exec($curl);
curl_close($curl);
print $result;
?>

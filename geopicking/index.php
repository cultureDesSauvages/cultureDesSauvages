<?php
$url = 'https://api.gbif.org/v1/species/match?name=allium%20ursinum';
$curl = curl_init($url);

curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
//curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "GET");
//curl_setopt( $curl, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
//curl_setopt($curl, CURLOPT_POSTFIELDS, $encodedData);
$result = curl_exec($curl);


if($result === false)
{
    echo 'Curl error: ' . curl_error($curl);
}
else
{
    echo 'Operation completed without any errors';
}

curl_close($curl);
print $result;
?>

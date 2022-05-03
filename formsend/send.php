<?php
$to = 'axi83@mail.ru';

if ( isset( $_POST['sendMail'] ) ) {
	$name	= substr( $_POST['name'], 0, 64 );
	$tel = substr( $_POST['tel'], 0, 64 );
	$email	 = substr( $_POST['email'], 0, 64 );
	$message = substr( $_POST['message'], 0, 250 );

if($_FILES)
{
	$filepath = array();
	$filename = array();
	$i = 0;
		foreach ($_FILES["file"]["error"] as $key => $error) {
			if ($error == UPLOAD_ERR_OK) {
				$filename[$i][0] = $_FILES["file"]["tmp_name"][$key];
				$filename[$i][1] = $_FILES["file"]["name"][$key];
				$i++;
			}
		}
	}

	$body = "Имя:\r\n".$name."\r\n\r\n";
	$body .= "Контактный номер:\r\n".$tel."\r\n\r\n";
	$body .= "E-mail:\r\n".$email."\r\n\r\n";
	$body .= "Описание заказа:\r\n".$message;
	send_mail($to, $body, $email, $filename);
}

// Вспомогательная функция для отправки почтового сообщения с вложением
function send_mail($to, $body, $email, $filename)
{
	$subject = 'Тестирование формы с прикреплением файла с сайта proverstka.com.ua';
	$boundary = "--".md5(uniqid(time())); // генерируем разделитель
	$headers = "From: ".$email."\r\n";
	$headers .= "MIME-Version: 1.0\r\n";
	$headers .="Content-Type: multipart/mixed; boundary=\"".$boundary."\"\r\n";
	$multipart = "--".$boundary."\r\n";
	$multipart .= "Content-type: text/plain; charset=\"utf-8\"\r\n";
	$multipart .= "Content-Transfer-Encoding: quoted-printable\r\n\r\n";

	$body = $body."\r\n\r\n";

	$multipart .= $body;
	foreach ($filename as $key => $value) {
		$fp = fopen($value[0], "r");
		$content = fread($fp, filesize($value[0]));
		fclose($fp);
		$file .= "--".$boundary."\r\n";
		$file .= "Content-Type: application/octet-stream\r\n";
		$file .= "Content-Transfer-Encoding: base64\r\n";
		$file .= "Content-Disposition: attachment; filename=\"".$value[1]."\"\r\n\r\n";
		$file .= chunk_split(base64_encode($content))."\r\n";
	}
	$multipart .= $file."--".$boundary."--\r\n";
	mail($to, $subject, $multipart, $headers);
}
?>
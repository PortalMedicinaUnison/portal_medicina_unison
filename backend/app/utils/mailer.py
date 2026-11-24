"""
Envío de correos por SMTP (biblioteca estándar, sin servicios de pago): sirve una cuenta
institucional o de Gmail con contraseña de aplicación. Si SMTP_HOST no está configurado,
el portal funciona igual y el restablecimiento de contraseña lo hace la coordinación.
"""
import logging
import smtplib
import ssl
from email.message import EmailMessage

from core.settings import settings

logger = logging.getLogger("portal.mailer")


def send_email(to: str, subject: str, body: str) -> bool:
    """Envía un correo de texto. Devuelve False (y lo registra) si falla; nunca lanza la excepción."""
    if not settings.email_enabled:
        return False
    message = EmailMessage()
    message["From"] = settings.SMTP_FROM
    message["To"] = to
    message["Subject"] = subject
    message.set_content(body)
    try:
        if settings.SMTP_SSL:
            server = smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT, context=ssl.create_default_context(), timeout=20)
        else:
            server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=20)
        with server:
            if settings.SMTP_STARTTLS and not settings.SMTP_SSL:
                server.starttls(context=ssl.create_default_context())
            if settings.SMTP_USER:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD or "")
            server.send_message(message)
        return True
    except Exception:  # noqa: BLE001 - un fallo de correo no debe tumbar la petición
        logger.exception("No se pudo enviar el correo a %s", to)
        return False

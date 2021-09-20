const express = require('express');
const router = express.Router();
const emailTest = require('../utils/emailTest');

router.get('/', async (req, res) => {
  console.log(req.query.x);
  // Enviar email de prueba de cuenta
  // https://api.granada47.com/v1/email?x=drlorenesi%40gmail.com
  const { info, err } = await emailTest(req.query.x);
  if (err) return res.status(500).send({ mensaje: err });
  console.log(info);
  res.send({
    mensaje: 'Correo enviado!',
    accepted: info.accepted,
    rejected: info.rejected,
    response: info.response,
    info: info.envelope,
    messageId: info.messageId,
  });
});

module.exports = router;

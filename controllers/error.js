exports.get404 = (req, res, next) => {
  res.status(404).render('404', {
    pageTitle: 'Page Not Found',
    path: '/404',
  });
};

exports.createError = (status, message) => {
  const err = new Error();
  err.status = status;
  err.message = message;
  return err;
};
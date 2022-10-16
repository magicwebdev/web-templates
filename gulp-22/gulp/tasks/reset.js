// Данный импорт работает только с версией del@6.1.1, версия del@7.0.0 вызывает ошибку
import del from 'del';

export const reset = () => {
  return del(app.path.clean);
};

// 👇 ❇️ Riki for the group success 👊
// modal_alerts.jsx - Servicio reutilizable para toda la app

import Swal from 'sweetalert2';

// Configuración centralizada de estilos y fuentes
const modalStyles = {
  titleFont: 'Montserrat, sans-serif',
  textFont: 'Roboto, sans-serif',
  errorColor: '#d33',
  successColor: '#28a745',
  confirmColor: '#3085d6',
  cancelColor: '#aaa',
  titleColor: '#4682B4',
  textColor: '#333',
};

/**
 * Muestra un modal de error con mensaje personalizado.
 * @param {string} message - Mensaje a mostrar.
 */
export const showErrorAlert = (message) => {
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: message,
    confirmButtonColor: modalStyles.errorColor,
    background: '#f8f9fa',
    customClass: {
      title: 'modal-title-error',
      htmlContainer: 'modal-text',
    },
  });
};

/**
 * Muestra un modal de éxito con mensaje y callback opcional.
 * @param {string} message - Mensaje a mostrar.
 * @param {function} [callback] - Función a ejecutar al cerrar el modal.
 * @param {boolean} [forceButton=false] - Forzar botón en lugar de autodesaparecer.
 */
export const showSuccessAlert = (message, callback = null, forceButton = false) => {
  Swal.fire({
    title: '¡Éxito!',
    text: message,
    icon: 'success',
    confirmButtonText: 'Okey',
    confirmButtonColor: modalStyles.successColor,
    background: '#f8f9fa',
    showConfirmButton: forceButton, // ✅ Solo se muestra si lo forzás
    timer: forceButton ? undefined : 3000,
    timerProgressBar: !forceButton,
    customClass: {
      title: 'modal-title-success',
      htmlContainer: 'modal-text',
    },
    allowOutsideClick: false,
    allowEscapeKey: false,
  }).then(() => {
    if (!forceButton && typeof callback === 'function') {
      callback();
    }
  });
};

/**
 * Muestra un modal de confirmación con dos opciones.
 * @param {string} title - Título del modal.
 * @param {string} text - Mensaje del modal.
 * @param {function} onConfirm - Acción al confirmar.
 * @param {function} [onCancel] - Acción al cancelar (opcional).
 */
export const showConfirmationAlert = (title, text, onConfirm, onCancel = null) => {
  Swal.fire({
    title: title,
    text: text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No',
    confirmButtonColor: modalStyles.confirmColor,
    cancelButtonColor: modalStyles.cancelColor,
    background: '#f8f9fa',
    customClass: {
      title: 'modal-title-success',
      htmlContainer: 'modal-text',
    },
  }).then((result) => {
    if (result.isConfirmed) {
      if (typeof onConfirm === 'function') onConfirm();
    } else {
      if (typeof onCancel === 'function') onCancel();
    }
  });
};

/**
 * Muestra un modal de carga (spinner).
 */
export const showLoadingAlert = () => {
  Swal.fire({
    title: 'Cargando...',
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
    background: '#f8f9fa',
    customClass: {
      title: 'modal-title-success',
    },
  });
};

/**
 * Cierra cualquier modal activo.
 */
export const closeAlert = () => {
  Swal.close();
};

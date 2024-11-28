import toast, {Toaster} from 'react-hot-toast';
export default function toastAlert(type, message) {
 
  if (type == 'success'||type=='succes') {
    toast.success(message, {
      // style: {
      //   fontWeight: 600,
      //   letterSpacing: '1px',
      // },
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  }
  if (type == 'error') {
    toast.error(message, {
      // style: {
      //   fontWeight: 600,
      //   letterSpacing: '1px',
      // },
      style: {
        borderRadius: '10px',
        background: 'red',
        color: '#fff',
      },
    });
  }
  if (type == 'info') {
    toast(message, {
      icon: 'ℹ',
      style: {
        borderRadius: '10px',
        fontWeight: 700,
        letterSpacing: '1px',
        background: 'blue',
        color: '#fff',
      },
    });
  }

  if (type == 'loading') {
    toast(message, {
      // duration: 3000,
      style: {
        borderRadius: '10px',
        fontWeight: 700,
        letterSpacing: '1px',
        background: 'orange',
        color: '#fff',
      },
    });
  }

  return (
    <div>
      <Toaster toastOptions={{
          // Define default options
          duration: 8000,
          style: {
            zIndex: 2147483647,
          },
        }} position="top-center" />
    </div>
  );
}
// import toast, { Toaster } from 'react-hot-toast';

// let toastQueue = [];
// let isDisplayingToast = false;

// export default function toastAlert(type, message) {
//   toastQueue.push({ type, message });
//   showNextToast();
// }

// function showNextToast() {
//   if (isDisplayingToast || toastQueue.length === 0) return; // Exit if a toast is already being displayed

//   const { type, message } = toastQueue.shift(); // Get the first message from the queue
//   isDisplayingToast = true;

//   let toastConfig = {
//     style: {
//       borderRadius: '10px',
//       color: '#fff',
//     },
//     onClose: () => {
//       isDisplayingToast = false;
//       setTimeout(showNextToast, 500); // Small delay before showing the next toast
//     },
//   };

//   if (type === 'success' || type === 'succes') {
//     toastConfig = {
//       ...toastConfig,
//       style: { ...toastConfig.style, background: '#333' },
//     };
//     toast.success(message, toastConfig);
//   } else if (type === 'error') {
//     toastConfig = {
//       ...toastConfig,
//       style: { ...toastConfig.style, background: 'red' },
//     };
//     toast.error(message, toastConfig);
//   } else if (type === 'info') {
//     toastConfig = {
//       ...toastConfig,
//       style: { ...toastConfig.style, background: 'blue', fontWeight: 700, letterSpacing: '1px' },
//     };
//     toast(message, { ...toastConfig, icon: 'ℹ' });
//   } else if (type === 'loading') {
//     toastConfig = {
//       ...toastConfig,
//       style: { ...toastConfig.style, background: 'orange', fontWeight: 700, letterSpacing: '1px' },
//     };
//     toast(message, toastConfig);
//   }
  
//   return (
//     <div>
//       <Toaster toastOptions={{ duration: 8000, style: { zIndex: 2147483647 } }} position="top-center" />
//     </div>
//   );
// }

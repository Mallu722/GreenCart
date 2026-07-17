export const showToast = (message, type = 'success') => {
  const toastContainer = document.getElementById('toast-container')
  if (!toastContainer) return

  const toast = document.createElement('div')
  toast.className = `toast ${type === 'error' ? 'bg-red-600' : 'bg-green-600'} text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in`
  toast.textContent = message

  toastContainer.appendChild(toast)

  setTimeout(() => {
    toast.remove()
  }, 3000)
}

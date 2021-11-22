import { useCallback } from 'react'

export const useToast = () => {
  return useCallback((text: string) => {
    if (window.M && text) {
      console.log('error text: ', text)
      window.M.toast({ html: text })
    }
  }, [])
}

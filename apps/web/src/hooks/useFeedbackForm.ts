import { useState } from 'react'
import { DEFAULT_FORM } from '@/constants/request'

export function useFeedbackForm() {
  const [formData, setFormData] = useState(DEFAULT_FORM)

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setFormData(DEFAULT_FORM)
  }

  return { formData, updateField, resetForm }
}

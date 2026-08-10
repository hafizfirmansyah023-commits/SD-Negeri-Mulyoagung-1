import { useState, ChangeEvent, FormEvent } from 'react';
import { ComplaintFormData, DEFAULT_COMPLAINT_FORM, buildWhatsAppUrl } from '../utils/contactHelpers.ts';

export const useComplaintForm = () => {
  const [formData, setFormData] = useState<ComplaintFormData>(DEFAULT_COMPLAINT_FORM);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.nama.trim() || !formData.pesan.trim()) return;

    window.open(buildWhatsAppUrl(formData), '_blank');
  };

  return { formData, handleChange, handleSubmit };
};

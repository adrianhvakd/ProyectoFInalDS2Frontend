'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { createClient } from '@/utils/supabase/client';
import { Service } from '@/types/service';
import { uploadPaymentProof, validateImageFile } from '@/utils/storage/payment';
import { 
  Building2, MapPin, Phone, Upload, Loader2, X, Image, 
  Check, QrCode, CreditCard, CheckCircle, Copy, Clipboard 
} from 'lucide-react';

interface CheckoutModalProps {
  service: Service;
  isOpen: boolean;
  onClose: () => void;
}

interface CheckoutFormData {
  company_name: string;
  company_address: string;
  company_phone: string;
}

function generateFakeQR(): string {
  const data = {
    amount: Math.floor(Math.random() * 1000) + 100,
    reference: `MIN-${Date.now()}`,
    concept: 'Pago MineMonitor',
    timestamp: new Date().toISOString(),
  };
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify(data))}`;
}

export default function CheckoutModal({ service, isOpen, onClose }: CheckoutModalProps) {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [paymentPreview, setPaymentPreview] = useState<string | null>(null);
  const [orderCreated, setOrderCreated] = useState<number | null>(null);
  const [qrCode, setQrCode] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { register, handleSubmit, formState: { errors }, getValues } = useForm<CheckoutFormData>();

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Archivo inválido');
      return;
    }

    setError(null);
    setPaymentFile(file);
    
    const reader = new FileReader();
    reader.onload = () => {
      setPaymentPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removePaymentFile = () => {
    setPaymentFile(null);
    setPaymentPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const goToStep2 = () => {
    const formData = getValues();
    if (!formData.company_name || !formData.company_address || !formData.company_phone) {
      setError('Por favor completa todos los campos');
      return;
    }
    setQrCode(generateFakeQR());
    setError(null);
    setStep(2);
  };

  const goToStep3 = () => {
    setError(null);
    setStep(3);
  };

  const onSubmit = async () => {
    if (!paymentFile) {
      setError('Debes subir el comprobante de pago');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fileName = await uploadPaymentProof(paymentFile);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      const { data: order, error: orderError } = await supabase
        .from('order')
        .insert({
          user_id: user.id,
          service_id: service.id,
          company_name: getValues('company_name'),
          company_address: getValues('company_address'),
          company_phone: getValues('company_phone'),
          payment_proof_filename: fileName,
          status: 'pending_review',
        })
        .select()
        .single();

      if (orderError) throw new Error(orderError.message);

      setOrderCreated(order.id);
      setStep(4);
    } catch (err: any) {
      setError(err.message || 'Error al crear el pedido');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setPaymentFile(null);
    setPaymentPreview(null);
    setOrderCreated(null);
    setError(null);
    onClose();
  };

  const steps = [
    { id: 1, name: 'Datos', icon: Building2 },
    { id: 2, name: 'Pago', icon: QrCode },
    { id: 3, name: 'Comprobante', icon: Upload },
    { id: 4, name: 'Listo', icon: CheckCircle },
  ];

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl bg-base-200 border border-base-300">
        <button 
          onClick={handleClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex justify-center mb-6">
          <ul className="steps steps-horizontal w-full max-w-md">
            {steps.map((s) => (
              <li 
                key={s.id} 
                className={`step ${step >= s.id ? 'step-primary' : ''}`}
              >
                <span className="text-xs mt-1">{s.name}</span>
              </li>
            ))}
          </ul>
        </div>

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Datos de Empresa */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-base-content text-center mb-6">
              Datos de tu Empresa
            </h3>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content">Nombre de la Empresa</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/50" />
                <input
                  type="text"
                  placeholder="Minera ACME S.A."
                  className="input input-bordered w-full pl-10 bg-base-100"
                  {...register('company_name', { 
                    required: 'El nombre es obligatorio',
                    minLength: { value: 3, message: 'Mínimo 3 caracteres' }
                  })}
                />
              </div>
              {errors.company_name && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.company_name.message}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content">Dirección</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/50" />
                <input
                  type="text"
                  placeholder="Av. Principal 123, Ciudad"
                  className="input input-bordered w-full pl-10 bg-base-100"
                  {...register('company_address', { 
                    required: 'La dirección es obligatoria',
                    minLength: { value: 5, message: 'Mínimo 5 caracteres' }
                  })}
                />
              </div>
              {errors.company_address && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.company_address.message}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content">Teléfono</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/50" />
                <input
                  type="tel"
                  placeholder="+51 987 654 321"
                  className="input input-bordered w-full pl-10 bg-base-100"
                  {...register('company_phone', { 
                    required: 'El teléfono es obligatorio',
                    minLength: { value: 7, message: 'Mínimo 7 dígitos' }
                  })}
                />
              </div>
              {errors.company_phone && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.company_phone.message}</span>
                </label>
              )}
            </div>

            <div className="modal-action">
              <button onClick={goToStep2} className="btn btn-primary">
                Continuar
                <Check className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: QR de Pago */}
        {step === 2 && (
          <div className="text-center space-y-6">
            <h3 className="text-xl font-bold text-base-content">
              Escanea el QR para Pagar
            </h3>
            
            <div className="bg-white p-4 rounded-xl inline-block">
              <img src={qrCode} alt="QR de pago" className="w-48 h-48" />
            </div>

            <div className="bg-base-100 p-4 rounded-lg text-left max-w-sm mx-auto">
              <p className="text-sm text-base-content/70 mb-2">
                <span className="font-semibold">Servicio:</span> {service.name}
              </p>
              <p className="text-2xl font-bold text-primary">
                {service.price === 0 ? 'Gratis' : `$${service.price}`}
              </p>
              <p className="text-xs text-base-content/50 mt-2">
                Después de pagar, sube el comprobante en el siguiente paso
              </p>
            </div>

            <div className="modal-action justify-center gap-4">
              <button onClick={() => setStep(1)} className="btn btn-ghost">
                Atrás
              </button>
              <button onClick={goToStep3} className="btn btn-primary">
                Ya pagué
                <Check className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Subir Comprobante */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-base-content text-center mb-6">
              Sube tu Comprobante de Pago
            </h3>

            {!paymentPreview ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-base-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Image className="w-12 h-12 mx-auto text-base-content/30 mb-4" />
                <p className="text-base-content/70 mb-2">
                  Haz click para subir el comprobante
                </p>
                <p className="text-xs text-base-content/50">
                  Solo imágenes (JPEG, PNG, WebP) - Máximo 5MB
                </p>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={paymentPreview}
                  alt="Comprobante"
                  className="w-full max-h-64 object-contain rounded-xl bg-base-100 mx-auto"
                />
                <button
                  type="button"
                  onClick={removePaymentFile}
                  className="absolute top-2 right-2 btn btn-circle btn-sm bg-base-100/80 hover:bg-error hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="modal-action justify-center gap-4">
              <button onClick={() => setStep(2)} className="btn btn-ghost">
                Atrás
              </button>
              <button 
                onClick={onSubmit} 
                disabled={!paymentFile || loading}
                className="btn btn-primary"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    Confirmar Pedido
                    <Check className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Confirmado */}
        {step === 4 && orderCreated && (
          <div className="text-center space-y-6 py-8">
            <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>
            <h3 className="text-2xl font-bold text-base-content">
              ¡Pedido Creado!
            </h3>
            <p className="text-base-content/70">
              Tu pedido #{orderCreated} ha sido creado y está en revisión.
              <br />
              Te notificaremos cuando sea aprobado.
            </p>
            <div className="modal-action justify-center">
              <button onClick={handleClose} className="btn btn-primary">
                Finalizar
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="modal-backdrop" onClick={handleClose}></div>
    </div>
  );
}

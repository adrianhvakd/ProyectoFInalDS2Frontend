'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { createClient } from '@/utils/supabase/client';
import { Service } from '@/types/service';
import { SubscriptionAction, UpgradeCalculation, RenewalCalculation } from '@/types/subscription';
import { uploadPaymentProof, validateImageFile } from '@/utils/storage/payment';
import { 
  Building2, MapPin, Phone, Upload, Loader2, X, Image, 
  Check, QrCode, CreditCard, CheckCircle, ArrowUpCircle, ArrowDownCircle 
} from 'lucide-react';

interface CheckoutModalProps {
  service: Service;
  action?: SubscriptionAction;
  isOpen: boolean;
  onClose: () => void;
}

interface CheckoutFormData {
  company_name: string;
  company_address: string;
  company_phone: string;
}

interface DowngradeCalculation {
  current_service: {
    id: number;
    name: string;
    price: number;
  };
  new_service: {
    id: number;
    name: string;
    price: number;
  };
  days_remaining: number;
  effective_date: string;
  message: string;
}

function generateFakeQR(servicePrice: number): string {
  const data = {
    amount: servicePrice,
    reference: `MIN-${Date.now()}`,
    concept: 'Pago MineMonitor',
    timestamp: new Date().toISOString(),
  };
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify(data))}`;
}

export default function CheckoutModal({ service, action = 'contract', isOpen, onClose }: CheckoutModalProps) {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [paymentPreview, setPaymentPreview] = useState<string | null>(null);
  const [orderCreated, setOrderCreated] = useState<number | null>(null);
  const [qrCode, setQrCode] = useState<string>('');
  const [renewalInfo, setRenewalInfo] = useState<RenewalCalculation | null>(null);
  const [upgradeInfo, setUpgradeInfo] = useState<UpgradeCalculation | null>(null);
  const [downgradeInfo, setDowngradeInfo] = useState<DowngradeCalculation | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { register, handleSubmit, formState: { errors }, getValues } = useForm<CheckoutFormData>();

  useEffect(() => {
    if (isOpen && action === 'renew') {
      loadRenewalInfo();
    } else if (isOpen && action === 'upgrade') {
      loadUpgradeInfo();
    } else if (isOpen && action === 'downgrade') {
      loadDowngradeInfo();
    }
  }, [isOpen, action, service.id]);

  async function loadRenewalInfo() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions/renewal/calculate`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setRenewalInfo(data);
      }
    } catch (e) {
      console.error('Error loading renewal info:', e);
    }
  }

  async function loadUpgradeInfo() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions/upgrade/calculate/${service.id}`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setUpgradeInfo(data);
      }
    } catch (e) {
      console.error('Error loading upgrade info:', e);
    }
  }

  async function loadDowngradeInfo() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions/downgrade/calculate/${service.id}`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setDowngradeInfo(data);
      }
    } catch (e) {
      console.error('Error loading downgrade info:', e);
    }
  }

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
    if (action === 'contract') {
      const formData = getValues();
      if (!formData.company_name || !formData.company_address || !formData.company_phone) {
        setError('Por favor completa todos los campos');
        return;
      }
    }
    
    if (action === 'downgrade') {
      setStep(2);
      return;
    }
    
    const amount = action === 'upgrade' && upgradeInfo 
      ? upgradeInfo.amount_to_pay 
      : action === 'renew' && renewalInfo 
        ? renewalInfo.total_to_pay 
        : service.price;
    
    setQrCode(generateFakeQR(amount));
    setError(null);
    setStep(2);
  };

  const goToStep3 = () => {
    setError(null);
    setStep(3);
  };

  const onSubmit = async () => {
    if (action === 'downgrade') {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions/downgrade/${service.id}`, {
          method: 'POST',
          credentials: 'include',
        });
        
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.detail || 'Error al procesar downgrade');
        }
        
        setPaymentSuccess(true);
        setStep(3);
      } catch (err: any) {
        setError(err.message || 'Error al procesar el downgrade');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!paymentFile) {
      setError('Debes subir el comprobante de pago');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fileName = await uploadPaymentProof(paymentFile);

      if (action === 'contract') {
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
        
      } else if (action === 'renew') {
        const formData = new FormData();
        formData.append('payment_proof', paymentFile);
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions/renewal`, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.detail || 'Error al crear pago de renovación');
        }
        
        setPaymentSuccess(true);
        setStep(4);
        
      } else if (action === 'upgrade') {
        const formData = new FormData();
        formData.append('payment_proof', paymentFile);
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions/upgrade/${service.id}`, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.detail || 'Error al procesar upgrade');
        }
        
        setPaymentSuccess(true);
        setStep(4);
      }
    } catch (err: any) {
      setError(err.message || 'Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setPaymentFile(null);
    setPaymentPreview(null);
    setOrderCreated(null);
    setPaymentSuccess(false);
    setRenewalInfo(null);
    setUpgradeInfo(null);
    setDowngradeInfo(null);
    setError(null);
    onClose();
  };

  const getStepLabels = () => {
    if (action === 'contract') {
      return [
        { id: 1, name: 'Datos', icon: Building2 },
        { id: 2, name: 'Pago', icon: QrCode },
        { id: 3, name: 'Comprobante', icon: Upload },
        { id: 4, name: 'Listo', icon: CheckCircle },
      ];
    }
    if (action === 'downgrade') {
      return [
        { id: 1, name: 'Resumen', icon: ArrowDownCircle },
        { id: 2, name: 'Confirmar', icon: Check },
        { id: 3, name: 'Listo', icon: CheckCircle },
      ];
    }
    return [
      { id: 1, name: 'Resumen', icon: action === 'upgrade' ? ArrowUpCircle : CreditCard },
      { id: 2, name: 'Pago', icon: QrCode },
      { id: 3, name: 'Comprobante', icon: Upload },
      { id: 4, name: 'Listo', icon: CheckCircle },
    ];
  };

  const steps = getStepLabels();

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

        {/* Step 1: Datos de Empresa o Resumen */}
        {step === 1 && action === 'contract' && (
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

        {/* Step 1: Resumen para Renewal/Upgrade */}
        {step === 1 && action !== 'contract' && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-base-content text-center mb-6">
              {action === 'upgrade' ? 'Mejorar tu Plan' : action === 'downgrade' ? 'Cambiar a Plan Inferior' : 'Pagar Mensualidad'}
            </h3>
            
            {action === 'renew' && renewalInfo && (
              <div className="bg-base-100 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-base-content/70">Plan actual:</span>
                  <span className="font-semibold">{renewalInfo.service_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/70">Días restantes:</span>
                  <span className="font-semibold">{renewalInfo.days_remaining} días</span>
                </div>
                <div className="divider"></div>
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Total a pagar:</span>
                  <span className="font-bold text-primary">${renewalInfo.total_to_pay}</span>
                </div>
              </div>
            )}

            {action === 'upgrade' && upgradeInfo && (
              <div className="bg-base-100 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-base-content/70">Plan actual:</span>
                  <span className="font-semibold">{upgradeInfo.current_service.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/70">Días restantes:</span>
                  <span className="font-semibold">{upgradeInfo.current_service.days_remaining} días</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/70">Credito por días:</span>
                  <span className="font-semibold text-success">-${upgradeInfo.current_service.credit.toFixed(2)}</span>
                </div>
                <div className="divider"></div>
                <div className="flex justify-between">
                  <span className="text-base-content/70">Nuevo plan:</span>
                  <span className="font-semibold">{upgradeInfo.new_service.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/70">Duración nueva:</span>
                  <span className="font-semibold">{upgradeInfo.new_period_days} días</span>
                </div>
                <div className="divider"></div>
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Total a pagar:</span>
                  <span className="font-bold text-primary">${upgradeInfo.amount_to_pay.toFixed(2)}</span>
                </div>
                <p className="text-xs text-success mt-2">
                  * Se te bonificarán {upgradeInfo.current_service.days_remaining} días de tu plan actual
                </p>
              </div>
            )}

            {action === 'downgrade' && downgradeInfo && (
              <div className="bg-base-100 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-base-content/70">Plan actual:</span>
                  <span className="font-semibold">{downgradeInfo.current_service.name}</span>
                </div>
                <div className="divider"></div>
                <div className="flex justify-between">
                  <span className="text-base-content/70">Nuevo plan:</span>
                  <span className="font-semibold">{downgradeInfo.new_service.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/70">Días restantes:</span>
                  <span className="font-semibold">{downgradeInfo.days_remaining} días</span>
                </div>
                <div className="divider"></div>
                <div className="bg-warning/10 p-3 rounded-lg">
                  <p className="text-sm text-warning">
                    {downgradeInfo.message}
                  </p>
                </div>
              </div>
            )}

            <div className="modal-action">
              <button onClick={goToStep2} className="btn btn-primary">
                Continuar
                <Check className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: QR de Pago o Confirmación de Downgrade */}
        {step === 2 && action !== 'downgrade' && (
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
                {action === 'upgrade' && upgradeInfo 
                  ? `$${upgradeInfo.amount_to_pay.toFixed(2)}`
                  : action === 'renew' && renewalInfo
                    ? `$${renewalInfo.total_to_pay}`
                    : service.price === 0 ? 'Gratis' : `$${service.price}`}
                {action !== 'contract' && <span className="text-sm font-normal text-base-content/60">/mes</span>}
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

        {/* Step 2: Confirmación de Downgrade */}
        {step === 2 && action === 'downgrade' && (
          <div className="text-center space-y-6">
            <h3 className="text-xl font-bold text-base-content">
              Confirmar Cambio de Plan
            </h3>
            
            <div className="bg-base-100 p-4 rounded-lg text-left max-w-sm mx-auto">
              <p className="text-sm text-base-content/70 mb-2">
                <span className="font-semibold">Cambio:</span> {downgradeInfo?.current_service.name} → {downgradeInfo?.new_service.name}
              </p>
              <p className="text-sm text-base-content/70">
                <span className="font-semibold">Fecha efectiva:</span> {downgradeInfo?.effective_date}
              </p>
              <p className="text-xs text-warning mt-4">
                * Este cambio se aplicará al vencer tu período actual. No hay costo adicional.
              </p>
            </div>

            <div className="modal-action justify-center gap-4">
              <button onClick={() => setStep(1)} className="btn btn-ghost">
                Atrás
              </button>
              <button 
                onClick={onSubmit} 
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    Confirmar Cambio
                    <Check className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Subir Comprobante */}
        {step === 3 && action !== 'downgrade' && (
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
        {step === 4 && (
          <div className="text-center space-y-6 py-8">
            <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>
            
            {action === 'contract' && orderCreated ? (
              <>
                <h3 className="text-2xl font-bold text-base-content">
                  ¡Pedido Creado!
                </h3>
                <p className="text-base-content/70">
                  Tu pedido #{orderCreated} ha sido creado y está en revisión.
                  <br />
                  Te notificaremos cuando sea aprobado.
                </p>
              </>
            ) : paymentSuccess ? (
              <>
                <h3 className="text-2xl font-bold text-base-content">
                  {action === 'downgrade' ? '¡Plan Actualizado!' : '¡Pago Enviado!'}
                </h3>
                <p className="text-base-content/70">
                  {action === 'upgrade' 
                    ? 'Tu solicitud de mejora de plan ha sido enviada y está en revisión.'
                    : action === 'downgrade'
                      ? `Tu plan será cambiado a ${downgradeInfo?.new_service.name} el ${downgradeInfo?.effective_date}.`
                      : 'Tu pago de mensualidad ha sido enviado y está en revisión.'}
                  <br />
                  Te notificaremos cuando sea aprobado.
                </p>
              </>
            ) : null}
            
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

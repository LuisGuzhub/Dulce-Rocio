
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

function ContactForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    productType: '',
    deliveryDate: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({ ...prev, eventType: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.productType || !formData.deliveryDate) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos obligatorios.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const submissions = JSON.parse(localStorage.getItem('dulcerocio_submissions') || '[]');
      submissions.push({
        ...formData,
        submittedAt: new Date().toISOString()
      });
      localStorage.setItem('dulcerocio_submissions', JSON.stringify(submissions));

      toast({
        title: "Solicitud enviada",
        description: "Gracias por tu interés. Te contactaremos pronto para discutir los detalles de tu pedido."
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        productType: '',
        deliveryDate: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: "Error al enviar",
        description: "Hubo un problema al procesar tu solicitud. Por favor intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Nombre completo *
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            className="text-foreground placeholder:text-muted-foreground"
            placeholder="María García"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Correo electrónico *
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="text-foreground placeholder:text-muted-foreground"
            placeholder="maria@ejemplo.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">
            Teléfono *
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            required
            className="text-foreground placeholder:text-muted-foreground"
            placeholder="+593 98 765 4321"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="productType" className="text-sm font-medium">
            Tipo de postre *
          </Label>
          <Select value={formData.productType} onValueChange={(value) => setFormData(prev => ({ ...prev, productType: value }))} required>
            <SelectTrigger id="productType" className="text-foreground">
              <SelectValue placeholder="Selecciona un postre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tiramisu">Tiramisú</SelectItem>
              <SelectItem value="pave">Pavé</SelectItem>
              <SelectItem value="brownies">Brownies</SelectItem>
              <SelectItem value="combo">Combo (varios postres)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="deliveryDate" className="text-sm font-medium">
          Fecha de entrega *
        </Label>
        <Input
          id="deliveryDate"
          name="deliveryDate"
          type="date"
          value={formData.deliveryDate}
          onChange={handleChange}
          required
          className="text-foreground"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-medium">
          Mensaje / Solicitudes especiales
        </Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          className="text-foreground placeholder:text-muted-foreground resize-none"
          placeholder="Cuéntanos qué postre deseas, sabor, tamaño o cualquier detalle especial..."
        />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="w-full transition-all duration-200 active:scale-[0.98]"
      >
        {isSubmitting ? 'Enviando...' : 'Enviar solicitud'}
      </Button>
    </form>
  );
}

export default ContactForm;

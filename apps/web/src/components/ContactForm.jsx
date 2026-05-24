import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      const parsed = JSON.parse(user);

      setFormData((prev) => ({
        ...prev,
        name: parsed.name || "",
        email: parsed.email || ""
      }));
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa nombre, correo, celular y mensaje.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("https://dulce-rocio.onrender.com/api/contact-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          productType: formData.productType,
          requestedDate: formData.deliveryDate,
          message: formData.message
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      toast({
        title: "Solicitud enviada",
        description: "Gracias por tu mensaje. Te contactaremos pronto para ayudarte con tu pedido especial."
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

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const minDate = tomorrow.toISOString().split("T")[0];

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
            readOnly={!!localStorage.getItem("user")}
            className={`text-foreground ${localStorage.getItem("user") ? "bg-[#f7efe9] cursor-not-allowed" : ""}`}
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
            readOnly={!!localStorage.getItem("user")}
            className={`text-foreground ${localStorage.getItem("user") ? "bg-[#f7efe9] cursor-not-allowed" : ""}`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">
            Celular *
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
            Tipo de solicitud
          </Label>
          <Select
            value={formData.productType}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, productType: value }))}
          >
            <SelectTrigger id="productType" className="text-foreground">
              <SelectValue placeholder="Selecciona una opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tiramisu">Tiramisú</SelectItem>
              <SelectItem value="pave">Pavé</SelectItem>
              <SelectItem value="brownies">Brownies</SelectItem>
              <SelectItem value="mesa-dulce">Mesa dulce</SelectItem>
              <SelectItem value="pedido-personalizado">Pedido personalizado</SelectItem>
              <SelectItem value="combo">Combo (varios postres)</SelectItem>
              <SelectItem value="consulta">Consulta general</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="deliveryDate" className="text-sm font-medium">
          Fecha tentativa
        </Label>
        <Input
          id="deliveryDate"
          name="deliveryDate"
          type="date"
          min={minDate}
          value={formData.deliveryDate}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-medium">
          Mensaje / Solicitudes especiales *
        </Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={6}
          required
          className="text-foreground placeholder:text-muted-foreground resize-none"
          placeholder="Cuéntanos si necesitas tiramisú, brownies, pavés, mesa dulce, cantidades, sabores, presupuesto o cualquier detalle especial..."
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

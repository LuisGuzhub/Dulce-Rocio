
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

function ServiceCard({ service }) {
  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="aspect-[4/3] overflow-hidden">
        <img 
          src={service.image} 
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardHeader>
        <CardTitle className="heading-serif text-2xl text-balance">{service.title}</CardTitle>
        <CardDescription className="leading-relaxed">{service.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-2">
          {service.benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
              <span className="leading-relaxed">{benefit}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button className="w-full transition-all duration-200 active:scale-[0.98]">
          Más información
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ServiceCard;

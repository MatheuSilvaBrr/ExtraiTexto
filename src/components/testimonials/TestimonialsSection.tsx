import React from 'react';
import { Star } from 'lucide-react';

type TestimonialProps = {
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
};

const Testimonial: React.FC<TestimonialProps> = ({ name, role, company, content, avatar, rating }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} 
          />
        ))}
      </div>
      <p className="text-gray-700 mb-6">{content}</p>
      <div className="flex items-center">
        <img 
          src={avatar} 
          alt={name} 
          className="h-12 w-12 rounded-full mr-4 object-cover"
        />
        <div>
          <h4 className="font-semibold">{name}</h4>
          <p className="text-sm text-gray-600">{role}, {company}</p>
        </div>
      </div>
    </div>
  );
};

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: "Ana Silva",
      role: "Professora",
      company: "UFMG",
      content: "O ExtraiTexto economiza horas do meu dia. Eu precisava converter textos de livros antigos e a precisão é incrível.",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150",
      rating: 5
    },
    {
      name: "Carlos Mendes",
      role: "Advogado",
      company: "Mendes & Associados",
      content: "Ferramenta essencial para meu escritório. Economizamos tempo convertendo documentos digitalizados em texto editável.",
      avatar: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150",
      rating: 5
    },
    {
      name: "Luisa Costa",
      role: "Estudante",
      company: "USP",
      content: "Uso o ExtraiTexto para digitalizar minhas anotações e materiais de estudo. A versão gratuita já é incrível!",
      avatar: "https://images.pexels.com/photos/3765175/pexels-photo-3765175.jpeg?auto=compress&cs=tinysrgb&w=150",
      rating: 4
    }
  ];

  return (
    <section className="py-16 px-6 md:px-10 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">O que nossos usuários dizem</h2>
        <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
          Milhares de pessoas já economizam tempo com o ExtraiTexto todos os dias.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};
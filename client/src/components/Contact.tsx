import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend/API
    console.log('Form submitted:', formData);
    
    toast({
      title: "Message Sent",
      description: "Thank you for contacting Abie's Cake. We'll get back to you soon!",
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      message: ''
    });
  };

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2 mb-12 lg:mb-0" data-aos="fade-right" data-aos-duration="1000">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-6">Get in Touch</h2>
            <div className="w-20 h-1 bg-[var(--pink-dark)] mb-6"></div>
            <p className="text-lg mb-8">
              Have a question or want to place an order? Reach out to us through any of the following channels or fill out the form.
            </p>
            
            <div className="mb-8">
              <div className="flex items-start mb-4">
                <div className="bg-[var(--pink-light)] p-3 rounded-full mr-4">
                  <i className="fas fa-envelope text-[var(--pink-dark)]"></i>
                </div>
                <div>
                  <h4 className="font-bold mb-1">Email</h4>
                  <a href="mailto:Imisioluwaajayi3@gmail.com" className="text-gray-600 hover:text-[var(--pink-dark)] transition-colors duration-300">
                    Imisioluwaajayi3@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start mb-4">
                <div className="bg-[var(--pink-light)] p-3 rounded-full mr-4">
                  <i className="fas fa-phone-alt text-[var(--pink-dark)]"></i>
                </div>
                <div>
                  <h4 className="font-bold mb-1">Phone</h4>
                  <a href="tel:+2348148048649" className="text-gray-600 hover:text-[var(--pink-dark)] transition-colors duration-300">
                    +234 814 804 8649
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-[var(--pink-light)] p-3 rounded-full mr-4">
                  <i className="fas fa-hashtag text-[var(--pink-dark)]"></i>
                </div>
                <div>
                  <h4 className="font-bold mb-1">Social Media</h4>
                  <div className="flex space-x-4">
                    <a href="https://instagram.com/abies_cake" className="text-gray-600 hover:text-[var(--pink-dark)] transition-colors duration-300">
                      <i className="fab fa-instagram mr-1"></i> @Abie's Cake
                    </a>
                    <a href="https://tiktok.com/@abies_cake" className="text-gray-600 hover:text-[var(--pink-dark)] transition-colors duration-300">
                      <i className="fab fa-tiktok mr-1"></i> @Abie's Cake
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 lg:pl-16" data-aos="fade-left" data-aos-duration="1000">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-playfair font-bold mb-6">Send us a Message</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 mb-2">Your Name</label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--pink)] transition"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 mb-2">Email Address</label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--pink)] transition"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-700 mb-2">Your Message</label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--pink)] transition"
                    placeholder="How can we help you?"
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-[var(--pink-dark)] hover:bg-[var(--pink)] text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

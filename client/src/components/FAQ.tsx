import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    question: "How far in advance should I order a cake?",
    answer: "For regular cakes, we recommend ordering at least 3-5 days in advance. For wedding cakes or special occasion cakes, we suggest 2-4 weeks to ensure we can accommodate your specific design and schedule."
  },
  {
    question: "Do you offer delivery services?",
    answer: "Yes, we offer delivery services within Lagos. Delivery fees vary based on location. For wedding cakes and large orders, we highly recommend our delivery service to ensure your cake arrives safely and in perfect condition."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept bank transfers, cash payments, and mobile payments through popular Nigerian payment apps. For custom orders, we require a 50% deposit to secure your order, with the remaining balance due before delivery or pickup."
  },
  {
    question: "Can you accommodate dietary restrictions?",
    answer: "Yes, we offer options for various dietary needs including eggless, nut-free, and reduced sugar cakes. Please inform us about any allergies or dietary restrictions when placing your order so we can accommodate accordingly."
  },
  {
    question: "How should I store my cake or pastries?",
    answer: "For best freshness, cakes should be stored in a cool place away from direct sunlight. Refrigerate cream-based cakes, but allow them to come to room temperature before serving for best taste. Pastries and snacks should be stored in an airtight container."
  },
  {
    question: "Can I customize the design and flavor of my cake?",
    answer: "Absolutely! We specialize in custom cakes and can create almost any design you desire. We offer a variety of flavors, fillings, and frostings that can be mixed and matched to create your perfect cake. Please contact us to discuss your specific requirements."
  },
  {
    question: "Do you offer tasting sessions before ordering a wedding cake?",
    answer: "Yes, we offer tasting sessions for wedding cakes by appointment. You can sample different cake flavors, fillings, and frostings to help you make your decision. Please contact us at least 3-4 months before your wedding to schedule a tasting."
  },
  {
    question: "What is your cancellation policy?",
    answer: "For standard cakes, cancellations made 48 hours or more before the pickup/delivery date will receive a full refund of any deposit. For custom or wedding cakes, cancellations made more than 2 weeks in advance will receive a 50% refund of the deposit. Cancellations with less notice may not be eligible for refunds as ingredients and preparation may have already begun."
  }
];

const FAQ = () => {
  return (
    <section id="faq" className="py-20 bg-[var(--gray-light)]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16" data-aos="fade-up" data-aos-duration="1000">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">Frequently Asked Questions</h2>
          <div className="w-20 h-1 bg-[var(--pink-dark)] mx-auto mb-6"></div>
          <p className="text-lg max-w-2xl mx-auto">
            Find answers to common questions about our products, ordering process, and more.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto" data-aos="fade-up" data-aos-duration="1000">
          <Accordion type="single" collapsible className="space-y-4">
            {faqData.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-[var(--gray)] rounded-lg overflow-hidden bg-white">
                <AccordionTrigger className="px-6 py-4 text-lg font-medium hover:bg-[var(--pink-light)] hover:text-[var(--pink-dark)] transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="mt-12 bg-white p-6 rounded-lg shadow-md text-center" data-aos="fade-up" data-aos-duration="1000">
            <h3 className="text-xl font-playfair font-bold mb-3">Still have questions?</h3>
            <p className="mb-6">If you couldn't find the answer to your question, feel free to contact us directly.</p>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <a 
                href="https://wa.me/2348148048649?text=Hello%20Abie%2C%20I%20have%20a%20question%20about%20your%20products!"
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center"
              >
                <i className="fab fa-whatsapp mr-2"></i>
                WhatsApp Us
              </a>
              <a 
                href="#contact"
                className="bg-[var(--pink-dark)] hover:bg-[var(--pink)] text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center"
              >
                <i className="fas fa-envelope mr-2"></i>
                Contact Form
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
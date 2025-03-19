"use client";

import { useState } from "react";
import { FaSearch } from "react-icons/fa";

const FAQandHelpCenter = () => {
  // Static FAQ data (replace with Sanity query if needed)
  const faqs = [
    {
      question: "What is the return policy?",
      answer: "You can return items within 30 days of purchase with the original receipt.",
    },
    {
      question: "How do I track my order?",
      answer: "Log into your account and check the order status under 'My Orders'.",
    },
    {
      question: "Is shipping free?",
      answer: "Yes, shipping is free for purchases above PKR 10,000.",
    },
    {
      question: "How can I contact support?",
      answer: "Use the contact form below or email us at support@mysticessence.com.",
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept credit cards, debit cards, and bank transfers.",
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState<string | null>(null);

  // Filter FAQs based on search query
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission (replace with API call in production)
    console.log("Form submitted:", formData);
    setFormStatus("Thank you! Your message has been sent.");
    setFormData({ name: "", email: "", message: "" }); // Clear form
    setTimeout(() => setFormStatus(null), 3000); // Clear status after 3 seconds
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-purple-700 to-purple-400 text-white rounded-lg shadow-lg">
      {/* Searchable FAQ Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="relative mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs..."
            className="w-full p-2 pl-10 rounded-md bg-purple-600 text-white placeholder-purple-200 border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-200" />
        </div>
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <div key={index} className="bg-purple-800 p-4 rounded-lg">
                <h3 className="font-semibold">{faq.question}</h3>
                <p className="text-gray-200 mt-2">{faq.answer}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-300">No FAQs found matching your search.</p>
          )}
        </div>
      </section>

      {/* Contact Form */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Contact Support</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-purple-600 text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder="Your name"
              required
            />
          </div>
          <div>
            <label className="block text-white mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-purple-600 text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder="Your email"
              required
            />
          </div>
          <div>
            <label className="block text-white mb-1">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-purple-600 text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300 h-24"
              placeholder="Your message"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-purple-500 text-white p-2 rounded-md hover:bg-purple-400 transition-colors w-full"
          >
            Submit
          </button>
          {formStatus && <p className="text-green-300 mt-2">{formStatus}</p>}
        </form>
      </section>

      <style jsx>{`
        @media (max-width: 640px) {
          .space-y-4 > * {
            width: 100%;
          }
          h2 {
            text-align: center;
          }
          .w-full {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default FAQandHelpCenter;
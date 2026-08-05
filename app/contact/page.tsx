import { PageHeader } from "@/components/site/PageHeader";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/site/ContactForm";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact · Book a free diagnostic assessment",
  description:
    "Get in touch with GausLab Maths Academy — book your free diagnostic assessment or ask about programs.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's chat about your child's maths journey."
        description="Book a free diagnostic assessment, ask about programs, or just say hi. We usually reply within a few hours during business days."
      />

      <section id="assessment" className="pb-16 sm:pb-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="rounded-3xl bg-navy-800 p-8 text-white shadow-lift">
                <h2 className="font-display text-2xl font-semibold">Get in touch</h2>
                <ul className="mt-6 space-y-4 text-sm">
                  <li className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-5 w-5 text-sky-300" />
                    <div>
                      <div className="font-semibold text-white">Call us</div>
                      <a href="tel:+61212345678" className="text-navy-200 hover:text-white">
                        +61 2 1234 5678
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-5 w-5 text-sky-300" />
                    <div>
                      <div className="font-semibold text-white">Email</div>
                      <a href="mailto:hello@gauslab.com.au" className="text-navy-200 hover:text-white">
                        hello@gauslab.com.au
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 text-sky-300" />
                    <div>
                      <div className="font-semibold text-white">Sydney studio</div>
                      <div className="text-navy-200">Level 3, 88 George Street<br />Sydney NSW 2000</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-5 w-5 text-sky-300" />
                    <div>
                      <div className="font-semibold text-white">Hours</div>
                      <div className="text-navy-200">
                        Mon–Fri · 9:00 – 20:00 AEST<br />
                        Sat · 9:00 – 17:00 AEST
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="mt-6 overflow-hidden rounded-3xl ring-1 ring-navy-100 shadow-soft">
                <iframe
                  title="GausLab Sydney studio location"
                  className="h-64 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://maps.google.com/maps?q=88+George+Street+Sydney&t=&z=15&ie=UTF8&iwloc=&output=embed"
                />
              </div>
            </div>

            <div className="lg:col-span-8">
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

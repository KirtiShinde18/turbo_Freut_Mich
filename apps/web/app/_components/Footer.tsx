import Link from "next/link";
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-neutral-50 dark:bg-zinc-950 mt-16">

      <div className="container mx-auto px-6 py-12 grid gap-10 md:grid-cols-4">

        {/* BRAND */}
        <div>
          <h2 className="text-2xl font-bold">Fruet Mich 👚</h2>
          <p className="text-sm text-gray-500 mt-3">
            Premium fashion store for men, women & kids.
            Discover your style with us.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/women">Women</Link></li>
            <li><Link href="/men">Men</Link></li>
            <li><Link href="/kids">Kids</Link></li>
          </ul>
        </div>

        {/* CUSTOMER */}
        <div>
          <h3 className="font-semibold mb-4">Customer Care</h3>
          <ul className="space-y-2 text-sm text-gray-500">
            <li>Contact Us</li>
            <li>Shipping Info</li>
            <li>Returns</li>
            <li>FAQ</li>
          </ul>
        </div>

        {/* SOCIAL */}
        <div>
          <h3 className="font-semibold mb-4">Follow Us</h3>

          <div className="flex gap-4">
            <a href="#" className="hover:text-pink-400">
              <FaInstagram />
            </a>

            <a href="#" className="hover:text-blue-400">
              <FaFacebook />
            </a>

            <a href="#" className="hover:text-sky-400">
              <FaTwitter />
            </a>
          </div>

          <p className="text-xs text-gray-400 mt-4">
            Stay connected for latest offers & trends.
          </p>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-gray-200 dark:border-white/10 py-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Fruet Mich. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;
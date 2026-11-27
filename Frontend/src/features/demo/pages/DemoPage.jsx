import BookDemoForm from "../components/BookDemoForm";
import demoImage from "../../../assets/images/demo-page-doc.png";

export default function DemoPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-8">
      <div className="w-full grid grid-cols-2  items-center">
        {/* Left Content */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Revolutionize Healthcare Operations with Smart, Scalable Solutions
          </h1>
          <p className="text-slate-600 mb-6">
            Discover how our healthcare management solutions can transform your
            practice. Our intuitive software offers a seamless experience for
            hospitals, labs, clinics, and pharmacies.
          </p>
          <img
            src={demoImage}
            alt="Healthcare"
            className="rounded-lg shadow-lg"
          />
        </div>

        {/* Right Form */}
        <div className="p-6">
          <BookDemoForm />
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to YourProduct</h1>
        <p className="text-lg md:text-xl mb-6 max-w-2xl">
          Empowering you to build, launch, and grow with simplicity and speed.
        </p>
        <a
          href="#features"
          className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition"
        >
          Learn More
        </a>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              title: "Fast Setup",
              desc: "Deploy your project in minutes with our intuitive tools.",
            },
            {
              title: "Scalable",
              desc: "Designed to grow with your team and your ambition.",
            },
            {
              title: "Secure",
              desc: "Top-tier security built into every layer of our platform.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-gray-100 p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-700">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 bg-indigo-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
        <p className="mb-6">Sign up now and unlock your potential with YourProduct.</p>
        <a
          href="#"
          className="px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold shadow hover:bg-gray-100"
        >
          Get Started
        </a>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} YourCompany. All rights reserved.
      </footer>
    </main>
  );
}

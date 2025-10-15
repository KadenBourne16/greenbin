import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="flex flex-row justify-end p-4">
        <a href="/login" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200">Login</a>
      </div>
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-green-800 mb-6">
          Smart Recycling
          <span className="block text-green-600">Made Simple</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Join the movement towards a cleaner planet with our intelligent waste management solutions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/signup" 
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200"
          >
            Setup an account
          </Link>
          <Link 
            href="/learn" 
            className="border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold py-3 px-8 rounded-lg transition duration-200"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '♻️',
                title: 'Smart Sorting',
                description: 'Our AI-powered system helps you sort waste correctly every time.'
              },
              {
                icon: '📱',
                title: 'Easy Tracking',
                description: 'Monitor your recycling impact and track your environmental footprint.'
              },
              {
                icon: '🌱',
                title: 'Eco Rewards',
                description: 'Earn points and rewards for your sustainable efforts.'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-green-50 p-8 rounded-xl text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-green-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Ready to make a difference?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of people already reducing their environmental impact with Greenbin.
          </p>
          <Link 
            href="/signup" 
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200"
          >
            Get Started for Free
          </Link>
        </div>
      </section>
    </main>
  );
}
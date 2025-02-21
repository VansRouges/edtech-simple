import { Book, BarChart, MessageCircle } from "lucide-react"

const features = [
  {
    name: "Comprehensive Dashboard",
    description: "View student's overall academic performance, including average grades and progress over time.",
    icon: BarChart,
  },
  {
    name: "Easy Communication",
    description: "Direct messaging system between school administrators and teachers for quick and efficient communication.",
    icon: MessageCircle,
  },
  {
    name: "Academic Tracking",
    description:
      "Monitor assignments, upcoming tests, and project deadlines to help your students stay on top of their studies.",
    icon: Book,
  },
]

export function Features() {
  return (
    <div className="py-12 bg-white" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to stay connected
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Our platform offers a range of features designed to enhance communication between school administrators and teachers.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}


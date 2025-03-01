import { GoogleAuthButton } from "../components/GoogleAuthButton"
import { Card } from "../components/Card"

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Gradient Header */}
      <div className="w-full bg-gradient-to-b from-[#00008B] via-[#00008B] to-white py-32 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl mb-8">AltCredit</h1>
        <p className="mt-3 max-w-md mx-auto text-base text-white/90 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl mb-10">
          Reimagining financial access for everyone
        </p>
        {/* CTA Section */}
        <GoogleAuthButton />
      </div>

      {/* Content Section with Cards */}
      <main className="flex-grow w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          <Card>
            <p className="text-gray-700">
              AltCredit is revolutionizing the way people access financial services by providing alternative credit
              scoring methods that look beyond traditional metrics. Our platform analyzes a broader range of financial
              behaviors to create a more inclusive and accurate picture of creditworthiness. This approach opens doors
              for millions who have been overlooked by conventional credit systems, allowing them to access loans,
              credit cards, and other financial products that were previously out of reach.
            </p>
          </Card>

          <Card>
            <p className="text-gray-700">
              Founded on the principle that financial access should be equitable, AltCredit leverages advanced machine
              learning algorithms to identify patterns in spending, saving, and earning that traditional credit bureaus
              miss. We securely connect to users' financial accounts to gather data, always with explicit permission and
              the highest privacy standards. Our technology has been validated through partnerships with leading
              financial institutions who recognize the value of our more nuanced approach to risk assessment. The result
              is a win-win: lenders reduce default rates while expanding their customer base.
            </p>
          </Card>

          <Card>
            <p className="text-gray-700">
              Using AltCredit is simple and transparent. After creating an account, users connect their financial
              information and receive a comprehensive credit profile within minutes. This profile includes not just a
              score, but actionable insights on how to improve financial health. We provide personalized recommendations
              tailored to each user's unique situation, helping them build stronger credit over time. Our community of
              users reports an average 30% improvement in credit access within six months of joining AltCredit,
              demonstrating the real-world impact of our innovative approach.
            </p>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-50 py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} AltCredit. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default LandingPage


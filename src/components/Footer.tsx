
const Footer = () => {
  return (
    <div>
      <footer className="bg-gray-200 text-center p-4 flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} UniForm. All rights reserved.
          </div>
          <div className="mt-2">
            <a href="/privacy-policy" className="text-blue-500 hover:underline">Privacy Policy</a> |
            <a href="/terms-of-service" className="text-blue-500 hover:underline ml-2">Terms of Service</a>
          </div>
        </div>

        <div className="flex items-center space-x-8 p-2 mr-16">
          <a href="/about-us" className="text-blue-500 hover:underline mt-2 block">About Us</a>
          <a href="/contact" className="text-blue-500 hover:underline mt-2 block">Contact</a>
          <a href="/help" className="text-blue-500 hover:underline mt-2 block">Help Center</a>
        </div>
      </footer>
    </div>
  )
}

export default Footer
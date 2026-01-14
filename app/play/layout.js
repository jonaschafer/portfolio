import Navigation from '../../components/Navigation'

export default function PlayLayout({ children }) {
  return (
    <div className="min-h-screen">
      <Navigation backgroundColor="white" textColor="black" underlineColor="black" arrowColor="black" />
      {children}
    </div>
  )
}

'use client'

import Navigation from '../../components/Navigation'
import GelsCalculator from '../../components/GelsCalculator'

export default function GelsCCPage() {
  return (
    <div className="min-h-screen">
      <Navigation
        backgroundColor="#edeae5"
        textColor="#525252"
        underlineColor="#525252"
        arrowColor="#525252"
      />
      <GelsCalculator />
    </div>
  )
}

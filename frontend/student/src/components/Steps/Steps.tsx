import { UserRoundCheck, CircleArrowRight, Landmark, Send, ChartNoAxesColumn } from 'lucide-react';
import './Steps.css';

const Steps = () => {
  return (
    <div className="steps-container">
      <h2 className='text-center md:text-start'>
        Steps to Apply
      </h2>
      <div className="steps-grid">
        <div className='step-item'>
          <UserRoundCheck className='card-icon step-item-icon' />
          <h3>Profile</h3>
        </div>
        <CircleArrowRight className='card-icon step-arrow-icon' />
        <div className='step-item'>
          <Landmark className='card-icon step-item-icon' />
          <h3>Select Uni</h3>
        </div>
        <CircleArrowRight className='card-icon step-arrow-icon' />
        <div className='step-item'>
          <Send className='card-icon step-item-icon' />
          <h3>Apply</h3>
        </div>
        <CircleArrowRight className='card-icon step-arrow-icon' />
        <div className='step-item'>
          <ChartNoAxesColumn className='card-icon step-item-icon' />
          <h3>Track</h3>
        </div>
      </div>
    </div>
  )
}

export default Steps
import { FileText, ChartLine, AlarmClockCheck } from 'lucide-react';

const Features = () => {
  return (
    <div className='card-holder m-4'>
      <div className='card'>
        <FileText className='card-icon' />
        <h3>Unified Application Form</h3>
        <p>
          One form to apply to multiple universities seamlessly
        </p>
      </div>
      <div className='card'>
        <ChartLine className='card-icon' />
        <h3>Real-Time Tracking</h3>
        <p>
          Monitor your applications status in real-time
        </p>
      </div>
      <div className='card'>
        <AlarmClockCheck className='card-icon' />
        <h3>Deadline Reminders</h3>
        <p>
          Never miss an application deadline with timely reminders
        </p>
      </div>
    </div>
  )
}

export default Features
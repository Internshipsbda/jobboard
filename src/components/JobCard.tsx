import React from 'react';
import { MapPin } from 'lucide-react';
import { Job } from '../types/Job';

interface JobCardProps {
  job: Job;
  onClick: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1"
    >
      {/* Company Info */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            src={job.logo}
            alt={`${job.company} logo`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">{job.company}</h3>
          <p className="text-gray-600 font-medium mb-2">{job.title}</p>
          <div className="flex items-center text-gray-500 text-sm mb-2">
            <MapPin size={14} className="mr-1 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
        </div>
      </div>

      {/* Payment Status */}
      <div className="mb-4">
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
            job.isPaid
              ? 'bg-green-100 text-green-800'
              : 'bg-orange-100 text-orange-800'
          }`}
        >
          {job.isPaid ? 'Paid' : 'Unpaid'}
        </span>
      </div>

      {/* Skills */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {job.skills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
              +{job.skills.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Apply Button */}
      <button
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        Apply Now
      </button>
    </div>
  );
};

export default JobCard;
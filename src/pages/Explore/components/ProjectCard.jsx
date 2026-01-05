import { Star } from 'lucide-react';
import { FaGithub } from "react-icons/fa";
import languageColors from '../../../styles/languageColors';

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-(--card-bg) p-5 rounded-xl border border-(--main-border-color) hover:border-(--primary-button-active) transition">
      <div className="flex items-center justify-between mb-2">
        <div className='flex gap-2 justify-center items-center'>
          <h3 className="font-bold text-[22px]">{project.name}</h3>
          <span className='bg-(--meta-tag-color) px-2 py-0.5 rounded-[34px] text-[12px] text-(--secondary-text-color)'>
            {project.visibility}
          </span>
        </div>
        <span className="text-xs text-(--secondary-text-color) flex items-center gap-1">
          <Star size={16} />
          {project.stars}
          <FaGithub size={16}/>
        </span>
      </div>

      <div className='flex items-center gap-3 mb-2'>
        <h4 className='font-semibold text-(--mid-dim-font-color) text-[20px]'>{project.owner}</h4>
        <button className='bg-(--meta-tag-color) px-2 py-0.5 rounded-[34px] text-[12px] text-(--secondary-text-color)'>
          Owner
        </button>
      </div>

      <p className="text-sm font-light text-(--primary-text-color) mb-4">
        {project.description}
      </p>

      <div className="mb-4">
        <div className="h-2 bg-gray-700 rounded overflow-hidden flex">
          {project.languages?.map((lang) => (
            <div
              key={lang.label}
              className="h-full"  
              style={{
                width: `${lang.value}%`,
                backgroundColor: lang.color || languageColors[lang.label] || '#6b7280',
              }}
              title={`${lang.label}: ${lang.value}%`}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {project.languages?.map((lang) => (
            <div key={lang.label} className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded" style={{ backgroundColor: lang.color || '#6b7280' }} />
              <span className="text-(--mid-dim-text-color)">{lang.label}</span>
              <span className="text-(--secondary-text-color)">{lang.value}%</span>
            </div>
          ))}
        </div>
      </div>

      <h3 className='font-semibold text-[12px] mb-2'>Collaborators</h3>   
      <div className="flex -space-x-2">
        <img src={project.avatar} className="w-7 h-7 rounded-full bg-gray-600 border border-[#141722]" alt="owner" />
        <div className="w-7 h-7 rounded-full bg-gray-600 border border-[#141722]" />
      </div>
    </div>
  );
};

export default ProjectCard;
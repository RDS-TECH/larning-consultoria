import Modal from '@components/Objects/StyledElements/Modal/Modal';
import Image, { StaticImageData } from 'next/image';
import React, { useEffect, useState } from 'react';
import OnBoardWelcome from '@public/onboarding/OnBoardWelcome.png';
import OnBoardCourses from '@public/onboarding/OnBoardCourses.png';
import OnBoardActivities from '@public/onboarding/OnBoardActivities.png';
import OnBoardEditor from '@public/onboarding/OnBoardEditor.png';
import OnBoardAI from '@public/onboarding/OnBoardAI.png';
import OnBoardUGs from '@public/onboarding/OnBoardUGs.png';
import OnBoardAccess from '@public/onboarding/OnBoardAccess.png';
import OnBoardMore from '@public/onboarding/OnBoardMore.png';
import OnBoardAssignments from '@public/onboarding/OnBoardAssignments.png';
import OnBoardPayments from '@public/onboarding/OnBoardPayments.png';
import { ArrowRight, Book, Check, Globe, Info, PictureInPicture, Sparkle, Sprout, SquareUser, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getUriWithOrg } from '@services/config/config';
import { useOrg } from '@components/Contexts/OrgContext';
import useAdminStatus from '@components/Hooks/useAdminStatus';
import { useTranslations } from 'next-intl';

interface OnboardingStep {
  imageSrc: StaticImageData;
  title: string;
  description: string;
  buttons?: {
    label: string;
    action: () => void;
    icon?: React.ReactNode;
  }[];
}

const Onboarding: React.FC = () => {
  const t = useTranslations('onboarding');
  const [currentStep, setCurrentStep] = useState(() => {
    // Initialize with saved step or 0
    const savedStep = localStorage.getItem('onboardingLastStep');
    return savedStep ? parseInt(savedStep) : 0;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(true);
  const [isTemporarilyClosed, setIsTemporarilyClosed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const org = useOrg() as any;
  const isUserAdmin = useAdminStatus() as any;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const onboardingData: OnboardingStep[] = [
    {
      imageSrc: OnBoardWelcome,
      title: t('steps.welcome.title'),
      description: t('steps.welcome.description'),
    },
    {
      imageSrc: OnBoardCourses,
      title: t('steps.courses.title'),
      description: t('steps.courses.description'),
      buttons: [
        {
          label: t('steps.courses.createButton'),
          action: () => router.push(getUriWithOrg(org?.slug, '/courses?new=true')),
          icon: <Book size={16} />,
        },
      ],
    },
    {
      imageSrc: OnBoardActivities,
      title: t('steps.activities.title'),
      description: t('steps.activities.description'),
      buttons: [
        {
          label: t('steps.activities.learnMoreButton'),
          action: () => window.open('https://university.learnhouse.io/course/be89716c-9992-44bb-81df-ef3d76e355ba', '_blank'),
          icon: <Info size={16} />,
        },
      ],
    },
    {
      imageSrc: OnBoardEditor,
      title: t('steps.editor.title'),
      description: t('steps.editor.description'),
      buttons: [
        {
          label: t('steps.editor.learnMoreButton'),
          action: () => window.open('https://university.learnhouse.io/course/be89716c-9992-44bb-81df-ef3d76e355ba', '_blank'),
          icon: <Info size={16} />,
        },
      ],
    },
    {
      imageSrc: OnBoardAI,
      title: t('steps.ai.title'),
      description: t('steps.ai.description'),
      buttons: [
        {
          label: t('steps.ai.learnMoreButton'),
          action: () => window.open('https://docs.learnhouse.app/features/ai/students', '_blank'),
          icon: <Sparkle size={16} />,
        },
      ],
    },
    {
      imageSrc: OnBoardUGs,
      title: t('steps.usergroups.title'),
      description: t('steps.usergroups.description'),
      buttons: [
        {
          label: t('steps.usergroups.createButton'),
          action: () => router.push(getUriWithOrg(org?.slug, '/dash/users/settings/usergroups')),
          icon: <SquareUser size={16} />,
        },
      ],
    },
    {
      imageSrc: OnBoardAccess,
      title: t('steps.access.title'),
      description: t('steps.access.description'),
      buttons: [

      ],
    },
    {
      imageSrc: OnBoardAssignments,
      title: t('steps.assignments.title'),
      description: t('steps.assignments.description'),
      buttons: [
        {
          label: t('steps.assignments.createButton'),
          action: () => router.push(getUriWithOrg(org?.slug, '/dash/assignments?new=true')),
          icon: <Book size={16} />,
        },
      ],
    },
    {
      imageSrc: OnBoardPayments,
      title: t('steps.payments.title'),
      description: t('steps.payments.description'),
      buttons: [
        {
          label: t('steps.payments.settingsButton'),
          action: () => router.push(getUriWithOrg(org?.slug, '/dash/payments/customers')),
          icon: <CreditCard size={16} />,
        },
      ],
    },
    {
      imageSrc: OnBoardMore,
      title: t('steps.more.title'),
      description: t('steps.more.description'),
      buttons: [
        {
          label: t('steps.more.universityButton'),
          action: () => window.open('https://university.learnhouse.io', '_blank'),
          icon: <Globe size={16} />,
        },
      ],
    },
  ];

  useEffect(() => {
    // Check both completion and temporary closure status
    const isOnboardingCompleted = localStorage.getItem('isOnboardingCompleted');
    const temporarilyClosed = localStorage.getItem('onboardingTemporarilyClosed');
    const lastClosedTime = localStorage.getItem('onboardingLastClosedTime');

    setIsOnboardingComplete(isOnboardingCompleted === 'true');
    setIsTemporarilyClosed(temporarilyClosed === 'true');

    // If temporarily closed, check if 24 hours have passed
    if (temporarilyClosed === 'true' && lastClosedTime) {
      const hoursSinceClosed = (Date.now() - parseInt(lastClosedTime)) / (1000 * 60 * 60);
      if (hoursSinceClosed >= 24) {
        // Reset temporary closure after 24 hours
        localStorage.removeItem('onboardingTemporarilyClosed');
        localStorage.removeItem('onboardingLastClosedTime');
        setIsTemporarilyClosed(false);
      }
    }

    // Show modal if onboarding is not completed and not temporarily closed
    setIsModalOpen(!isOnboardingCompleted && !temporarilyClosed);
  }, []);

  // Update stored step whenever currentStep changes
  useEffect(() => {
    localStorage.setItem('onboardingLastStep', currentStep.toString());
  }, [currentStep]);

  const handleModalClose = () => {
    // Store temporary closure status and timestamp
    localStorage.setItem('onboardingTemporarilyClosed', 'true');
    localStorage.setItem('onboardingLastClosedTime', Date.now().toString());
    // Current step is already saved via the useEffect above
    setIsTemporarilyClosed(true);
    setIsModalOpen(false);
  };

  const nextStep = () => {
    if (currentStep < onboardingData.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Mark onboarding as completed in local storage
      localStorage.setItem('isOnboardingCompleted', 'true');
      localStorage.removeItem('onboardingLastStep'); // Clean up stored step
      setIsModalOpen(false);
      setIsOnboardingComplete(true);
    }
  };

  const skipOnboarding = () => {
    localStorage.setItem('isOnboardingCompleted', 'true');
    localStorage.removeItem('onboardingLastStep'); // Clean up stored step
    setIsModalOpen(false);
    setIsOnboardingComplete(true);
  };

  const goToStep = (index: number) => {
    if (index >= 0 && index < onboardingData.length) {
      setCurrentStep(index);
    }
  };

  return (
    <div>
      {isUserAdmin.isAdmin && !isUserAdmin.loading && !isOnboardingComplete && !isMobile && <Modal
        isDialogOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        minHeight="sm"
        minWidth='md'
        dialogContent={
          <OnboardingScreen
            step={onboardingData[currentStep]}
            onboardingData={onboardingData}
            currentStep={currentStep}
            nextStep={nextStep}
            skipOnboarding={skipOnboarding}
            setIsModalOpen={handleModalClose}
            goToStep={goToStep}
          />
        }
        dialogTrigger={
          <div className='fixed pb-10 w-full bottom-0 bg-linear-to-t from-1% from-gray-950/25 to-transparent'>
            <div className='bg-gray-950 flex space-x-2 font-bold cursor-pointer hover:bg-gray-900 shadow-md items-center text-gray-200 px-5 py-2 w-fit rounded-full mx-auto'>
              <Sprout size={20} />
              <p>{t('trigger.label')}</p>
              <div className='h-2 w-2 bg-green-500 animate-pulse rounded-full'></div>
              <div
                className="ml-2 pl-2 border-l border-gray-700 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  skipOnboarding();
                }}
              >
                <Check size={16} className="hover:text-green-500" />
              </div>
            </div>
          </div>
        }
      />}
    </div>
  );
};

interface OnboardingScreenProps {
  step: OnboardingStep;
  currentStep: number;
  nextStep: () => void;
  skipOnboarding: () => void;
  goToStep: (index: number) => void;
  setIsModalOpen: (value: boolean) => void;
  onboardingData: OnboardingStep[];
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  step,
  currentStep,
  nextStep,
  skipOnboarding,
  goToStep,
  onboardingData,
  setIsModalOpen,
}) => {
  const t = useTranslations('onboarding');
  const isLastStep = currentStep === onboardingData.length - 1;

  return (
    <div className='flex flex-col'>
      <div className='onboarding_screens flex-col px-4 py-4'>
        <div className='grow rounded-xl'>
          <Image 
            unoptimized 
            className='mx-auto shadow-md shadow-gray-200 rounded-lg w-[730px] h-[330px] object-cover' 
            alt='' 
            priority 
            quality={100} 
            src={step.imageSrc} 
          />
        </div>
        <div className='grid grid-flow-col justify-stretch space-x-3 mt-4'>
          {onboardingData.map((_, index) => (
            <div
              key={index}
              onClick={() => goToStep(index)}
              className={`h-[7px] w-auto ${index === currentStep ? 'bg-black' : 'bg-gray-300'} hover:bg-gray-700 rounded-lg shadow-md cursor-pointer`}
            ></div>
          ))}
        </div>
      </div>
      <div className='onboarding_text flex flex-col h-[90px] py-2 px-4 leading-tight'>
        <h2 className='text-xl font-bold'>{step.title}</h2>
        <p className='text-md font-normal'>{step.description}</p>
      </div>
      <div className='onboarding_actions flex flex-row-reverse w-full px-4'>
        <div className='flex flex-row justify-between w-full py-2'>
          <div className='utils_buttons flex flex-row space-x-2'>
            <div
              className="inline-flex items-center px-5 space-x-1 cursor-pointer py-1 rounded-full text-gray-600 antialiased font-bold bg-gray-100 hover:bg-gray-200"
              onClick={() => setIsModalOpen(false)}
            >
              <PictureInPicture size={16} />
            </div>
            <div
              className="inline-flex items-center px-5 space-x-2 cursor-pointer py-1 rounded-full text-gray-600 antialiased font-bold bg-gray-100 hover:bg-gray-200"
              onClick={skipOnboarding}
            >
              <p>{t('buttons.end')}</p>
              <Check size={16} />
            </div>
          </div>
          <div className='actions_buttons flex space-x-2'>
            {step.buttons?.map((button, index) => (
              <div
                key={index}
                className="inline-flex items-center px-5 space-x-2 cursor-pointer py-1 rounded-full text-gray-200 antialiased font-bold bg-black hover:bg-gray-700 shadow-md whitespace-nowrap"
                onClick={button.action}
              >
                <p>{button.label}</p>
                {button.icon}
              </div>
            ))}
            {isLastStep ? (
              <div
                className="inline-flex items-center px-5 space-x-2 cursor-pointer py-1 rounded-full text-gray-200 antialiased font-bold bg-black hover:bg-gray-700 shadow-md whitespace-nowrap"
                onClick={nextStep}
              >
                <p>{t('buttons.finish')}</p>
                <Check size={16} />
              </div>
            ) : (
              <div
                className="inline-flex items-center px-5 space-x-2 cursor-pointer py-1 rounded-full text-gray-200 antialiased font-bold bg-black hover:bg-gray-700 shadow-md whitespace-nowrap"
                onClick={nextStep}
              >
                <p>{t('buttons.next')}</p>
                <ArrowRight size={16} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
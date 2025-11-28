import { useRouter } from "next/navigation";

export default function BackButton() {
    const router = useRouter();

    const goBack = () => {
        router.back();
    };

    return (
        <button
            onClick={goBack}
            className='p-3 cursor-pointer'
            aria-label='Go back'>
            <svg
                xmlns='http://www.w3.org/2000/svg'
                width='17'
                height='30'
                viewBox='0 0 17 30'
                fill='none'>
                <path
                    d='M14.6575 27.1699L2.14497 14.6574L14.6575 2.14492'
                    stroke='white'
                    strokeWidth='4.29'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                />
            </svg>
        </button>
    );
}

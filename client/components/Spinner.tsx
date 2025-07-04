import { Loader } from 'lucide-react';

export default function Spinner() {
    return (
        <div className="flex items-center justify-center">
            <Loader className="animate-spin" />
        </div>
    );
}
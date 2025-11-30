'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Cfooter from '../components/cfooter';

export default function About() {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const onScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    let team = [
        { id: 'president-1', name: '', role: 'President', photo: '/placeholder.jpg', bio: '' },
        { id: 'president-2', name: '', role: 'President', photo: '/placeholder.jpg', bio: '' },
        { id: 'treasurer', name: '', role: 'Treasurer', photo: '/placeholder.jpg', bio: '' },
        { id: 'secretary', name: '', role: 'Secretary', photo: '/placeholder.jpg', bio: '' },
        { id: 'safety', name: '', role: 'Safety Director', photo: '/placeholder.jpg', bio: '' },
        { id: 'outreach', name: '', role: 'Outreach Director', photo: '/placeholder.jpg', bio: '' },
        { id: 'lab', name: '', role: 'Lab Director', photo: '/placeholder.jpg', bio: '' },
    ];

    return (
        <main className="relative min-w-full">
            <header className="relative h-[55vh] sm:h-[60vh] md:h-[68vh] -mt-[60px] sm:-mt-[80px] md:-mt-[105px] overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <Image
                        className="w-full h-full object-cover opacity-40"
                        alt="About background"
                        src="/logos/mono_text.png"
                        width={1600}
                        height={900}
                        priority
                        style={{
                            transform: `scale(1.15) translateX(${scrollY * 0.08}px) translateY(${scrollY * 0.04}px)`,
                            transition: 'transform 0.12s linear',
                            transformOrigin: 'center center',
                        }}
                    />
                </div>

                <div className="flex flex-col items-center justify-center h-full text-white text-center px-6">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                        Rensselaer Spaceflight Society
                    </h1>
                    <p className="mt-4 max-w-3xl text-base sm:text-lg text-white/90">
                        Our labs are located on the fourth floor of the Ricketts building, in 408 and 411.
                    </p>
                </div>
            </header>

            <section className="bg-white text-slate-800 py-12 sm:py-20">
                <div className="mx-auto max-w-6xl px-6 lg:px-8">
                    <div className="mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600">
                            About
                        </h2>
                        <div className="h-1 w-20 bg-gradient-to-r from-sky-600 to-indigo-600 rounded-full"></div>
                    </div>

                    <p className="text-lg text-slate-700 max-w-3xl">
                        Nothing here for now!
                    </p>
                </div>
            </section>

            <section className="bg-white text-slate-800 py-12 sm:py-16">
                <div className="mx-auto max-w-6xl px-6 lg:px-8">
                    <div className="mb-6">
                        <h3 className="text-xl sm:text-2xl font-semibold">Executive Board</h3>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 justify-center md:grid-cols-4">
                        {team.map((member) => (
                            <div key={member.id} className="rounded-lg bg-gray-50 p-4 text-center">
                                <div className="mx-auto h-28 w-28 overflow-hidden rounded-full bg-slate-200">
                                    <Image src={member.photo} alt={member.name} width={112} height={112} className="object-cover w-full h-full" />
                                </div>
                                <h4 className="mt-3 font-medium">{member.name}</h4>
                                <p className="text-sm text-slate-500">{member.role}</p>
                                <p className="mt-2 text-xs text-slate-600">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-gray-50 text-slate-800 py-10 sm:py-14">
                <div className="mx-auto max-w-6xl px-6 lg:px-8 text-center">
                    <h3 className="text-lg font-semibold">Join Us</h3>
                    <p className="mt-2 text-sm text-slate-600 max-w-2xl m-auto">We welcome students from all majors — whether you're an engineer, designer, or communicator, there's a place for you.</p>
                    <a href="https://discord.gg/Y8uVhAqGsQ" className="mt-6 inline-flex items-center rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800">Get Involved</a>
                </div>
            </section>
            <Cfooter />
        </main>
    );
}
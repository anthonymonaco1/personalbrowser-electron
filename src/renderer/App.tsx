import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import dashboard from '../../assets/dashboard.svg';
import trophy from '../../assets/trophy.svg';
import notes from '../../assets/notes.svg';
import github from '../../assets/github.svg';
import calendar from '../../assets/calendar-days.svg';
import './App.css';
import { useState } from 'react';
import FPLApp from './fploptimizer/App';
import CustomIframe from './CustomIframe';
import WeatherWidget from './WeatherWidget';
import OxfordUtd from '../../assets/Oxford_United_FC.png';
import mail from '../../assets/mail.svg';
import moon from '../../assets/moon.svg';
import chefhat from '../../assets/chef-hat.svg';

function Home() {
  // Type for the weather data state
  const [selected, setSelected] = useState<string>('dashboard');
  const [darkMode, setDarkMode] = useState(false);

  const handleToggle = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    window.electronAPI.toggleDarkMode(newMode);
  };

  const handleDashboardClick = () => {
    if (selected === 'calendar') {
      window.electronAPI.hideGoogleCalendar();
    }
    if (selected === 'notes') {
      window.electronAPI.hideFigmaNotes();
    }
    if (selected === 'github') {
      window.electronAPI.hideGithub();
    }
    if (selected === 'gmail') {
      window.electronAPI.hideGmail();
    }
    if (selected === 'chefbot') {
      window.electronAPI.hideChefBot();
    }
    setSelected('dashboard');
  };

  const handleNotesClick = () => {
    if (selected === 'notes') {
      // Optional: Toggle visibility
      // Uncomment the following lines to implement toggling
      /*
      window.electronAPI.hideFigmaNotes();
      setSelected('');
      */
    } else {
      if (selected === 'calendar') {
        window.electronAPI.hideGoogleCalendar();
      }
      if (selected === 'github') {
        window.electronAPI.hideGithub();
      }
      if (selected === 'gmail') {
        window.electronAPI.hideGmail();
      }
      if (selected === 'chefbot') {
        window.electronAPI.hideChefBot();
      }
      window.electronAPI.showFigmaNotes();
      setSelected('notes');
    }
  };

  const handleCalendarClick = () => {
    if (selected === 'calendar') {
      // Optional: Toggle visibility
      // Uncomment the following lines to implement toggling
      /*
      window.electronAPI.hideGoogleCalendar();
      setSelected('');
      */
    } else {
      // Hide other views
      if (selected === 'notes') {
        window.electronAPI.hideFigmaNotes();
      }
      if (selected === 'github') {
        window.electronAPI.hideGithub();
      }
      if (selected === 'gmail') {
        window.electronAPI.hideGmail();
      }
      if (selected === 'chefbot') {
        window.electronAPI.hideChefBot();
      }
      window.electronAPI.showGoogleCalendar();
      setSelected('calendar');
    }
  };

  const handleGmailClick = () => {
    if (selected === 'gmail') {
      // Optional: Toggle visibility
      // Uncomment the following lines to implement toggling
      /*
      window.electronAPI.hideGoogleCalendar();
      setSelected('');
      */
    } else {
      // Hide other views
      if (selected === 'notes') {
        window.electronAPI.hideFigmaNotes();
      }
      if (selected === 'github') {
        window.electronAPI.hideGithub();
      }
      if (selected === 'calendar') {
        window.electronAPI.hideGoogleCalendar();
      }
      if (selected === 'chefbot') {
        window.electronAPI.hideChefBot();
      }
      window.electronAPI.showGmail();
      setSelected('gmail');
    }
  };

  const handleGithubClick = () => {
    if (selected === 'github') {
      // Optional: Toggle visibility
      // Uncomment the following lines to implement toggling
      /*
      window.electronAPI.hideNotes();
      setSelected('');
      */
    } else {
      if (selected === 'notes') {
        window.electronAPI.hideFigmaNotes();
      }
      if (selected === 'calendar') {
        window.electronAPI.hideGoogleCalendar();
      }
      if (selected === 'gmail') {
        window.electronAPI.hideGmail();
      }
      if (selected === 'chefbot') {
        window.electronAPI.hideChefBot();
      }
      window.electronAPI.showGithub();
      setSelected('github');
    }
  };

  const handleChefBotClick = () => {
    if (selected === 'chefbot') {
      // Optional: Toggle visibility
      // Uncomment the following lines to implement toggling
      /*
      window.electronAPI.hideNotes();
      setSelected('');
      */
    } else {
      if (selected === 'notes') {
        window.electronAPI.hideFigmaNotes();
      }
      if (selected === 'calendar') {
        window.electronAPI.hideGoogleCalendar();
      }
      if (selected === 'gmail') {
        window.electronAPI.hideGmail();
      }
      if (selected === 'github') {
        window.electronAPI.hideGithub();
      }
      window.electronAPI.showChefBot();
      setSelected('chefbot');
    }
  };

  const handleFplOptimizerClick = () => {
    if (selected === 'calendar') {
      window.electronAPI.hideGoogleCalendar();
    }
    if (selected === 'notes') {
      window.electronAPI.hideFigmaNotes();
    }
    if (selected === 'github') {
      window.electronAPI.hideGithub();
    }
    if (selected === 'gmail') {
      window.electronAPI.hideGmail();
    }
    if (selected === 'chefbot') {
      window.electronAPI.hideChefBot();
    }
    setSelected('fploptimizer');
  };

  return (
    <div className="h-screen bg-base-grey">
      <div className="flex flex-col w-full h-full">
        <div className="flex flex-row w-full bg-black h-16 border-b-2 border-gray-500 p-2">
          <div className="flex flex-row items-center justify-evenly w-1/6 p-2">
            <div className="w-10">
              <img src={OxfordUtd} />
            </div>
            <div className="text-center text-3xl text-white font-bold leading-normal stroke-black font-capriola">
              Anthony
            </div>
          </div>
          <div className="flex flex-row justify-evenly items-center w-5/6">
            <div
              className={`${selected == 'dashboard' ? 'bg-white' : 'text-white'} flex flex-row w-1/8 rounded-3xl items-center p-2 space-x-2 cursor-pointer`}
              onClick={handleDashboardClick}
            >
              <div>
                <img
                  src={dashboard}
                  className={
                    selected === 'dashboard' ? 'icon-selected' : 'icon-default'
                  }
                />
              </div>
              <div className="font-semibold">Dashboard</div>
            </div>
            <div
              className={`${selected == 'notes' ? 'bg-white' : 'text-white'} flex flex-row w-1/8 rounded-3xl items-center p-2 space-x-2 cursor-pointer`}
              onClick={handleNotesClick}
            >
              <div>
                <img
                  src={notes}
                  className={
                    selected === 'notes' ? 'icon-selected' : 'icon-default'
                  }
                />
              </div>
              <div className="font-semibold">Notes</div>
            </div>
            <div
              className={`${selected == 'gmail' ? 'bg-white' : 'text-white'} flex flex-row w-1/8 rounded-3xl items-center p-2 space-x-2 cursor-pointer`}
              onClick={handleGmailClick}
            >
              <div>
                <img
                  src={mail}
                  className={
                    selected === 'gmail' ? 'icon-selected' : 'icon-default'
                  }
                />
              </div>
              <div className="font-semibold">Email</div>
            </div>
            <div
              className={`${selected == 'calendar' ? 'bg-white' : 'text-white'} flex flex-row w-1/8 rounded-3xl items-center justify-between p-1 space-x-2 cursor-pointer`}
              onClick={handleCalendarClick}
            >
              <div className="flex flex-row space-x-2">
                <img
                  src={calendar}
                  className={
                    selected === 'calendar' ? 'icon-selected' : 'icon-default'
                  }
                />
                <div className="font-semibold">Calendar</div>
              </div>

              {selected === 'calendar' && (
                <div
                  className="bg-base-grey rounded-full p-1 cursor-pointer"
                  onClick={handleToggle}
                >
                  <img src={moon} className={darkMode ? '' : 'icon-unfilled'} />
                </div>
              )}
            </div>
            <div
              className={`${selected == 'github' ? 'bg-white' : 'text-white'} flex flex-row w-1/8 rounded-3xl items-center p-2 space-x-2 cursor-pointer`}
              onClick={handleGithubClick}
            >
              <div>
                <img
                  src={github}
                  className={
                    selected === 'github' ? 'icon-selected' : 'icon-default'
                  }
                />
              </div>
              <div className="font-semibold">Github</div>
            </div>
            <div
              className={`${selected == 'chefbot' ? 'bg-white' : 'text-white'} flex flex-row w-1/8 rounded-3xl items-center p-2 space-x-2 cursor-pointer`}
              onClick={handleChefBotClick}
            >
              <div>
                <img
                  src={chefhat}
                  className={
                    selected === 'chefbot' ? 'icon-selected' : 'icon-default'
                  }
                />
              </div>
              <div className="font-semibold">ChefBot</div>
            </div>
            <div
              className={`${selected == 'fploptimizer' ? 'bg-white' : 'text-white'} flex flex-row w-1/8 rounded-3xl items-center p-2 space-x-2 cursor-pointer`}
              onClick={handleFplOptimizerClick}
            >
              <div>
                <img
                  src={trophy}
                  className={
                    selected === 'fploptimizer'
                      ? 'icon-selected'
                      : 'icon-default'
                  }
                />
              </div>
              <div className="font-semibold">FPL Optimizer</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {selected === 'dashboard' && (
          <div
            className="flex flex-row w-full"
            style={{ height: 'calc(100% - 64px)' }}
          >
            <div className="flex flex-col w-2/3 h-full">
              <div className="flex flex-row p-4 pb-1 space-x-2 h-1/2 w-full">
                <div className="flex flex-col p-3 pb-0 w-1/2 font-sans">
                  <CustomIframe
                    src="https://rss.app/embed/v1/feed/YB4GHP9p9SWRrxNZ"
                    title="bbc"
                  />
                </div>
                <div className="flex flex-col p-3 pb-0 w-1/2">
                  <CustomIframe
                    src="https://widgets.sociablekit.com/reddit-threads/iframe/25463221"
                    title="reddit"
                  />
                </div>
              </div>
              <div className="flex flex-row p-4 pb-1 space-x-2 h-1/2 w-full">
                <div className="flex p-3 w-1/2">
                  <CustomIframe
                    src="https://widgets.sociablekit.com/linkedin-profile-posts/iframe/25463190"
                    title="linkedin"
                  />
                </div>
                <div className="flex p-3 w-1/2">
                  <CustomIframe
                    src="https://widgets.sociablekit.com/twitter-feed/iframe/25463176"
                    title="twitter"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col w-1/3 h-full py-7 px-4 pb-4 space-y-6">
              <WeatherWidget />
              <CustomIframe
                src="https://rss.app/embed/v1/feed/nIXuYC6RNNDo7jJQ"
                title="medium"
              />
              <div style={{ height: 152 }}>
                <iframe
                  className="rounded-2xl w-full shadow-lg shadow-spotify"
                  src="https://open.spotify.com/embed/playlist/6R7nt1inAVGmZlB7KFMuDj?utm_source=generator"
                  height="152"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        )}

        {selected === 'fploptimizer' && (
          <div className="flex w-full items-center justify-center">
            <FPLApp />
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

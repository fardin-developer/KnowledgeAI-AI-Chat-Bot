import {useNavigate } from 'react-router-dom';
import './Home.css';
import Header from '../components/shared/Header';
const HomePage = () => {
  const navigate = useNavigate();

  const handleUploadRedirect = () => {
    document.body.style.opacity = '0.8';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
      navigate('/upload')
    }, 300);
  };

  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const features = [
    {
      icon: '📂',
      title: 'Upload Knowledge Base',
      description: 'Simply upload your FAQ documents, PDFs, manuals, or any text files. Our AI will instantly learn from your content.'
    },
    {
      icon: '🧠',
      title: 'AI-Powered Understanding',
      description: 'Advanced AI processes and understands your documents, creating a smart knowledge base that knows your business inside out.'
    },
    {
      icon: '💬',
      title: 'Instant Smart Replies',
      description: 'Customers get accurate answers instantly from YOUR knowledge base. No generic responses, only your company-specific information.'
    },
    {
      icon: '🔄',
      title: 'Always Up-to-Date',
      description: 'Update your knowledge base anytime. Upload new documents and the AI immediately incorporates the latest information.'
    },
    {
      icon: '🎯',
      title: 'Context-Aware Responses',
      description: 'AI understands context and provides relevant, detailed answers based on your specific documentation and FAQs.'
    },
    {
      icon: '📊',
      title: 'Smart Analytics',
      description: 'Track which topics customers ask about most, identify knowledge gaps, and optimize your content for better support.'
    }
  ];

  return (
    <div className="home-page">
      <style>{`
   
      `}</style>

      <div className="bg-animation">
        <div className="floating-shape shape1"></div>
        <div className="floating-shape shape2"></div>
        <div className="floating-shape shape3"></div>
        <div className="floating-shape shape4"></div>
      </div>

      {/* Header */}
   <Header/>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">AI-Powered Knowledge Base</h1>
          <p className="hero-subtitle">
            Upload your knowledge base, FAQs, or company documents and let AI provide instant, 
            accurate answers from your own content. Train once, serve customers 24/7.
          </p>
          
                     <div className="cta-buttons">
             <button className="btn btn-primary" onClick={handleUploadRedirect}>
               📁 Upload Knowledge Base
             </button>
             <button className="btn btn-secondary" onClick={() => smoothScrollTo('features')}>
               🤖 See How It Works
             </button>
           </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <h2 className="section-title">How Your Knowledge Base Works</h2>
          <p className="section-subtitle">
            Transform your static documents into an intelligent, conversational AI assistant
          </p>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

             {/* Floating Chat Icon */}
       <button className="chat-icon" onClick={() => navigate('/chat')} title="Chat">
         📁
       </button>
    </div>
  );
};

export default HomePage;
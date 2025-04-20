import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const TakeAssignment = () => {
  const [questions, setQuestions] = useState([]);
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/show_teacher_assignments/');
        setQuestions(response.data.questions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  const toggleActiveClass = (index) => {
    const updatedQuestions = questions.map((question, i) => {
      if (i === index) {
        return { ...question, active: !question.active };
      }
      return question;
    });
    setQuestions(updatedQuestions);
  };

  const handleDownloadPDF = () => {
    const input = document.getElementById("pdf-content");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("downloaded-file.pdf");
    });
  };

  return (
    <div className="container mx-auto p-4" >
      <div className="text-right mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleDownloadPDF}
        >
          Download PDF
        </button>
      </div>
      <div className="space-y-4" id="pdf-content" ref={contentRef}>
        {questions.map((question, index) => (
          <div
            key={index}
            className={`faq ${question.active ? 'active' : ''} bg-white border border-gray-300 rounded-lg p-4 shadow-sm`}
          >
            <h3 className="faq-title text-xl font-semibold">{question}</h3>
            <p className={`faq-text mt-2 ${question.active ? 'block' : 'hidden'}`}>
              This is the answer to the question.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TakeAssignment;

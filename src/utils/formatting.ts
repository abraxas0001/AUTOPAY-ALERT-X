/**
 * Formatting utilities for the application
 */

/**
 * Format AI response into structured bullet points
 */
export const formatAIResponse = (rawText: string): string => {
  if (!rawText || rawText.trim().length === 0) {
    return '';
  }

  // Remove excessive whitespace and normalize line breaks
  const normalized = rawText.trim().replace(/\n{3,}/g, '\n\n');

  // Split into sentences
  const sentences = normalized
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  // If no sentences, return empty
  if (sentences.length === 0) {
    return '';
  }

  // For very short inputs (1-2 sentences), just format as bullet points
  if (sentences.length <= 2) {
    let formatted = '**Analysis**\n\n';
    sentences.forEach(sentence => {
      formatted += `• ${sentence}\n`;
    });
    return formatted.trim();
  }

  // Group sentences into logical sections
  const sections: { title: string; points: string[] }[] = [];
  let currentSection: string[] = [];
  let currentTitle = 'Key Points';

  sentences.forEach((sentence) => {
    // Detect section headers (sentences with keywords or short length)
    const isHeader = sentence.length < 50 && 
      (sentence.includes(':') || 
       /^(overview|summary|key points|analysis|recommendation|conclusion)/i.test(sentence));

    if (isHeader) {
      // Save previous section if it has content
      if (currentSection.length > 0) {
        sections.push({
          title: currentTitle,
          points: currentSection
        });
        currentSection = [];
      }
      // Set new title
      currentTitle = sentence.replace(':', '').trim();
    } else {
      currentSection.push(sentence);
    }
  });

  // Add remaining section
  if (currentSection.length > 0) {
    sections.push({
      title: currentTitle,
      points: currentSection
    });
  }

  // If no sections were created, create a default one
  if (sections.length === 0) {
    sections.push({
      title: 'Analysis',
      points: sentences
    });
  }

  // Format as markdown with bullet points
  let formatted = '';
  sections.forEach(section => {
    if (section.points.length > 0) {
      formatted += `**${section.title}**\n\n`;
      section.points.forEach(point => {
        formatted += `• ${point}\n`;
      });
      formatted += '\n';
    }
  });

  return formatted.trim();
};

/**
 * Format date in Indian format (DD/MM/YYYY)
 */
export const formatIndianDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Format currency in Indian numbering system
 * Indian system: 1,00,000 (1 lakh), 10,00,000 (10 lakhs), 1,00,00,000 (1 crore)
 */
export const formatIndianCurrency = (amount: number, currency: string = '₹'): string => {
  const amountStr = Math.abs(amount).toString();
  const lastThree = amountStr.substring(amountStr.length - 3);
  const otherNumbers = amountStr.substring(0, amountStr.length - 3);
  
  const formatted = otherNumbers !== '' 
    ? otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree
    : lastThree;
  
  return `${currency}${amount < 0 ? '-' : ''}${formatted}`;
};

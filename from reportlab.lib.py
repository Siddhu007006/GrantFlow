from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def create_cosm_pdf(filename):
    doc = SimpleDocTemplate(filename, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []

    # Custom Styles
    title_style = styles['Title']
    heading_style = styles['Heading2']
    subheading_style = styles['Heading3']
    normal_style = styles['Normal']
    
    # Title
    story.append(Paragraph("COSM Important Questions & Solutions", title_style))
    story.append(Spacer(1, 12))
    story.append(Paragraph("<b>Subject:</b> Computer Oriented Statistical Methods (COSM)", normal_style))
    story.append(Paragraph("<b>Context:</b> B.Tech 2nd Year Exam Preparation", normal_style))
    story.append(Spacer(1, 12))
    story.append(Paragraph("---", normal_style))
    story.append(Spacer(1, 12))

    # Question 1
    story.append(Paragraph("1. Explain Classification of states in Markov process.", heading_style))
    story.append(Paragraph("<b>Reference:</b> Unit-V (Stochastic Processes and Markov Chains)", normal_style))
    story.append(Spacer(1, 6))
    
    story.append(Paragraph("<b>A. Accessibility</b>", subheading_style))
    story.append(Paragraph("A state <i>j</i> is accessible from state <i>i</i> if there is a positive probability of moving from <i>i</i> to <i>j</i> in a finite number of steps.", normal_style))
    story.append(Paragraph("<ul><li><b>Communicate:</b> If state <i>i</i> is accessible from <i>j</i> AND <i>j</i> is accessible from <i>i</i>, they communicate. This partitions states into communication classes.</li></ul>", normal_style))
    
    story.append(Paragraph("<b>B. Recurrence</b>", subheading_style))
    story.append(Paragraph("<ul><li><b>Recurrent State:</b> If the chain starts at state <i>i</i> and the probability of eventually returning to <i>i</i> is 1. It will be visited infinitely often.</li><li><b>Transient State:</b> If the probability of returning is less than 1. It will be visited only a finite number of times.</li></ul>", normal_style))

    story.append(Paragraph("<b>C. Periodicity</b>", subheading_style))
    story.append(Paragraph("<ul><li><b>Periodic:</b> If the chain can only return to state <i>i</i> in multiples of <i>d > 1</i> steps.</li><li><b>Aperiodic:</b> If the period is 1 (can return at irregular intervals).</li></ul>", normal_style))

    story.append(Paragraph("<b>D. Ergodic State</b>", subheading_style))
    story.append(Paragraph("A state is <b>Ergodic</b> if it is both <b>Recurrent</b> and <b>Aperiodic</b>.", normal_style))
    story.append(Spacer(1, 12))

    # Question 2
    story.append(Paragraph("2. Two-Sample Mean Test (Z-test)", heading_style))
    story.append(Paragraph("<b>Problem:</b> Sample 1 (n=1000, mean=67.5), Sample 2 (n=2000, mean=68.0). Population SD = 2.5. Are they from the same population?", normal_style))
    story.append(Spacer(1, 6))
    
    story.append(Paragraph("<b>Step 1: Hypotheses</b>", subheading_style))
    story.append(Paragraph("Null Hypothesis (H0): mu1 = mu2 (Means are equal)<br/>Alternative Hypothesis (H1): mu1 != mu2 (Means are different)", normal_style))
    
    story.append(Paragraph("<b>Step 2: Z-Statistic Calculation</b>", subheading_style))
    story.append(Paragraph("Formula: Z = (x1_bar - x2_bar) / sqrt(sigma^2 * (1/n1 + 1/n2))", normal_style))
    story.append(Paragraph("Numerator: 67.5 - 68.0 = -0.5", normal_style))
    story.append(Paragraph("Denominator: sqrt(2.5^2 * (1/1000 + 1/2000)) = sqrt(6.25 * 0.0015) = 0.0968", normal_style))
    story.append(Paragraph("<b>Z_calc = -0.5 / 0.0968 = -5.164</b>", normal_style))
    
    story.append(Paragraph("<b>Step 3: Conclusion</b>", subheading_style))
    story.append(Paragraph("Critical Z (at alpha=0.05) is +/- 1.96.<br/>Since |-5.164| > 1.96, we <b>Reject H0</b>.<br/><b>Result:</b> The samples are NOT from the same population.", normal_style))
    story.append(Spacer(1, 12))

    # Question 3
    story.append(Paragraph("3. Irreducibility of Transition Probability Matrix", heading_style))
    story.append(Paragraph("<b>Concept:</b> A Markov Chain is irreducible if it has only one communication class. Every state must be accessible from every other state.", normal_style))
    story.append(Paragraph("<b>Note:</b> The numerical matrix was not provided in the prompt. To solve this specifically, check if you can go from any State (A, B, C) to any other State (A, B, C) directly or via intermediate steps.", normal_style))
    story.append(Spacer(1, 12))

    # Question 4
    story.append(Paragraph("4. Probability of Sample Mean (Central Limit Theorem)", heading_style))
    story.append(Paragraph("<b>Problem:</b> n=100, Population Mean (mu)=76, Variance=256. Find P(75 < X_bar < 78).", normal_style))
    story.append(Spacer(1, 6))
    
    story.append(Paragraph("<b>Step 1: Parameters</b>", subheading_style))
    story.append(Paragraph("Standard Deviation (sigma) = sqrt(256) = 16.<br/>Standard Error (SE) = sigma / sqrt(n) = 16 / 10 = 1.6.", normal_style))
    
    story.append(Paragraph("<b>Step 2: Z-Scores</b>", subheading_style))
    story.append(Paragraph("Z = (X_bar - mu) / SE", normal_style))
    story.append(Paragraph("For 75: Z1 = (75 - 76) / 1.6 = -0.625", normal_style))
    story.append(Paragraph("For 78: Z2 = (78 - 76) / 1.6 = 1.25", normal_style))
    
    story.append(Paragraph("<b>Step 3: Probability</b>", subheading_style))
    story.append(Paragraph("P(-0.625 < Z < 1.25) = Area(0 to 0.625) + Area(0 to 1.25)", normal_style))
    story.append(Paragraph("Area(0.625) approx 0.234<br/>Area(1.25) approx 0.3944<br/>Total = 0.234 + 0.3944 = 0.6284", normal_style))
    
    story.append(Paragraph("<b>Result:</b> Probability is approx <b>62.85%</b>.", normal_style))

    doc.build(story)

create_cosm_pdf("COSM_Important_Questions_Solutions.pdf")
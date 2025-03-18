// utils/loadTestData.js
import AngularData from '@models/data/Angular.json';
import JavaData from '@models/data/Java.json';
import CData from '@models/data/C.json';
import CppData from '@models/data/Cpp.json';
import CSharpData from '@models/data/CSharp.json';
import CSSData from '@models/data/CSS.json';
import DjangoData from '@models/data/Django.json';
import DotNetData from '@models/data/DotNet.json';
import FlaskData from '@models/data/Flask.json';
import HibernateData from '@models/data/Hibernate.json';
import HTMLData from '@models/data/HTML.json';
import JavascriptData from '@models/data/Javascript.json';
import JspData from '@models/data/Jsp.json';
import ManualTestingData from '@models/data/ManualTesting.json';
import MongoData from '@models/data/MongoDB.json';
import PythonData from '@models/data/Paython.json';
import ReactData from '@models/data/React.json';
import RegressionTestingData from '@models/data/Regression Testing.json';
import SeleniumData from '@models/data/Selenium.json';
import ServletsData from '@models/data/Servlets.json';
import SpringBootData from '@models/data/Spring Boot.json';
import TSData from '@models/data/TS.json';
import SpringData from '@models/data/Spring.json';
import SQLData from '@models/data/SQL.json';
import VueData from '@models/data/Vue.json';

const loadTestData = (skillName: string) => {
  switch (skillName) {
    case 'Angular':
      return AngularData;
    case 'Java':
      return JavaData;
    case 'C':
      return CData;
    case 'C++':
      return CppData;
    case 'C Sharp':
      return CSharpData;
    case 'CSS':
      return CSSData;
    case 'Django':
      return DjangoData;
    case '.Net':
      return DotNetData;
    case 'Flask':
      return FlaskData;
    case 'Hibernate':
      return HibernateData;
    case 'HTML':
      return HTMLData;
    case 'JavaScript':
      return JavascriptData;
    case 'Python':
      return PythonData;
    case 'JSP':
      return JspData;
    case 'Manual Testing':
      return ManualTestingData;
    case 'Mongo DB':
      return MongoData;
    case 'React':
      return ReactData;
    case 'Regression Testing':
      return RegressionTestingData;
    case 'Selenium':
      return SeleniumData;
    case 'Servlets':
      return ServletsData;
    case 'Spring Boot':
      return SpringBootData;
    case 'TypeScript':
      return TSData;
    case 'Spring':
      return SpringData;
    case 'SQL':
      return SQLData;
    case 'Css':
      return CSSData;
    case 'MySQL':
      return SQLData;
    case 'Vue':
      return VueData;
    case 'SQL-Server':
      return SQLData;
    default:
      return {
        testName: 'Unknown Skill Test',
        duration: 'N/A',
        numberOfQuestions: 0,
        topicsCovered: [],
      };
  }
};

export default loadTestData;

export default {
  user: {
    userID: (value) => {
      const idRegex = /^[a-zA-Z0-9]{5,20}$/;

      if (value === '') {
        return {
          IDError: '필수 정보입니다.',
          IDValid: false,
        };
      } else if (/\s/.test(value)) {
        return {
          IDError: '공백은 사용할 수 없습니다.',
          IDValid: false,
        };
      } else if (!value.match(idRegex)) {
        return {
          IDError: '5~20자의 영문 대 소문자와 숫자만 사용 가능합니다.',
          IDValid: false,
        };
      }
      return {
        IDError: '',
        IDValid: true,
      };
    },

    pwd: (value) => {
      const pwdRegex = /^.*(?=.{8,16})(?=.*[0-9])(?=.*[a-zA-Z]).*$/;

      if (value === '') {
        return {
          pwd1Error: '필수 정보입니다.',
          pwd1Valid: false,
        };
      } else if (/\s/.test(value)) {
        return {
          pwd1Error: '공백은 사용할 수 없습니다.',
          pwd1Valid: false,
        };
      } else if (!value.match(pwdRegex)) {
        return {
          pwd1Error: '8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.',
          pwd1Valid: false,
        };
      }
      return {
        pwd1Error: '',
        pwd1Valid: true,
      };
    },

    name: (value) => {
      const nameRegex = /^[가-힣]{2,4}$/;

      if (value === '') {
        return {
          nameError: '필수 정보입니다.',
          nameValid: false,
        };
      } else if (!value.match(nameRegex)) {
        return {
          nameError: '이름을 정확히 입력해주세요.',
          nameValid: false,
        };
      }
      return {
        nameError: '',
        nameValid: true,
      };
    },

    email: (value) => {
      const emailRegex = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

      if (value === '') {
        return {
          emailError: '필수 정보입니다.',
          emailValid: false,
        };
      } else if (/\s/.test(value)) {
        return {
          emailError: '이메일을 정확히 입력해주세요',
          emailValid: false,
        };
      } else if (!value.match(emailRegex)) {
        return {
          emailError: '이메일을 정확히 입력해주세요',
          emailValid: false,
        };
      }
      return {
        emailError: '',
        emailValid: true,
      };
    },

    studentid: (value) => {
      const studentRegex = /^[0-9]{8}$/;

      if (value === '') {
        return {
          studentidError: '필수 정보입니다.',
          studentidValid: false,
        };
      } else if (/\s/.test(value)) {
        return {
          studentidError: '학번을 정확히 입력해주세요',
          studentidValid: false,
        };
      } else if (!value.match(studentRegex)) {
        return {
          studentidError: '학번을 정확히 입력해주세요',
          studentidValid: false,
        };
      }
      return {
        studentidError: '',
        studentidValid: true,
      };
    },
  },
};

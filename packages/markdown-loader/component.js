module.exports = (content, file) => {
  return `
  <template>
    <div>${content}</div>
  </template>

  <script>
  console.log(${JSON.stringify(content)}, '@' + ${JSON.stringify(file)});

  export default {
  }
  </script>
  `;
};

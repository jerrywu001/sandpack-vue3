import '@testing-library/jest-dom';

describe('dom test', () => {
  test('dom', () => {
    const div = document.createElement('div');
    div.id = 'adm-mask';
    expect(div).not.toBeNull();
    expect(div).toBeDefined();
    expect(div).toBeInstanceOf(HTMLDivElement);

    document.body.appendChild(div);

    const mask = document.body.querySelector('#adm-mask') as HTMLDivElement;
    expect(mask).toMatchSnapshot();
    div.remove();
    expect(mask).not.toBeInTheDocument();
  });
});
